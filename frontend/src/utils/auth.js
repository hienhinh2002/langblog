// src/utils/auth.js
export const TOKEN_KEY = 'token';

/** Lấy / đặt / xoá token */
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  // Mỗi lần token đổi -> set lại hẹn giờ auto logout
  scheduleAutoLogout();
};

/** Giải mã payload của JWT (không xác thực chữ ký) */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Epoch millis của thời điểm hết hạn (exp * 1000). Không có thì trả 0 */
export function getTokenExpMs() {
  const t = getToken();
  if (!t) return 0;
  const p = parseJwt(t);
  return p?.exp ? p.exp * 1000 : 0;
}

/** Vai trò từ claim 'role' hoặc 'authorities' */
export function getRole() {
  const t = getToken();
  const p = t ? parseJwt(t) : null;
  const claimRole =
    p?.role ||
    (Array.isArray(p?.authorities) ? p.authorities[0]?.authority : undefined) ||
    (Array.isArray(p?.roles) ? p.roles[0] : undefined);
  return claimRole || null;
}

/** Đăng nhập hợp lệ khi có token và chưa hết hạn */
export function isLoggedIn() {
  const exp = getTokenExpMs();
  return !!exp && exp > Date.now();
}

/** Admin nếu role chứa/đúng 'ADMIN' hoặc 'ROLE_ADMIN' */
export function isAdmin() {
  const r = getRole();
  if (!r) return false;
  return String(r).includes('ADMIN');
}

/** Đăng xuất + chuyển trang */
export function logout(redirect = '/login') {
  localStorage.removeItem(TOKEN_KEY);
  // tuỳ bạn: clear state khác ở đây
  window.location.replace(redirect);
}

/** Hẹn giờ tự logout khi đến thời điểm hết hạn của token */
let _logoutTimer;
export function scheduleAutoLogout() {
  clearTimeout(_logoutTimer);
  const expMs = getTokenExpMs();
  if (!expMs) return; // chưa có token
  const delay = expMs - Date.now() - 1000; // trừ 1s cho chắc
  if (delay <= 0) {
    logout();
    return;
  }
  _logoutTimer = setTimeout(() => logout(), delay);
}

/** Khởi động theo dõi auth: gọi 1 lần khi App mount */
export function initAuthWatch() {
  // đặt hẹn giờ cho token hiện tại
  scheduleAutoLogout();

  // Đồng bộ giữa các tab: nếu token đổi ở tab khác
  const onStorage = (e) => {
    if (e.key === TOKEN_KEY) scheduleAutoLogout();
  };
  window.addEventListener('storage', onStorage);

  // Khi interceptor báo 401 (hết hạn/không hợp lệ)
  const onExpired = () => logout();
  document.addEventListener('app:auth-expired', onExpired);

  // Trả về hàm cleanup nếu bạn muốn gọi trong useEffect
  return () => {
    window.removeEventListener('storage', onStorage);
    document.removeEventListener('app:auth-expired', onExpired);
    clearTimeout(_logoutTimer);
  };
}
