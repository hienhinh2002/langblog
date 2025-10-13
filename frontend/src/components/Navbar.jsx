// src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { isAdmin, isLoggedIn } from '../utils/auth';

/** Link Nav có thể thêm className */
function NavA({ to, children, onClick, end, className = '' }) {
  return (
    <NavLink
      to={to}
      end={end ?? to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'nav-item-active' : ''} ${className}`
      }
    >
      {children}
    </NavLink>
  );
}

/** điều hướng về Home với query language */
function gotoHomeLanguage(nav, lang, closeFns = []) {
  const qs = new URLSearchParams();
  if (lang && lang !== 'ALL') qs.set('language', lang);
  nav(`/${qs.toString() ? `?${qs}` : ''}`);
  closeFns.forEach((fn) => fn && fn(false));
}

/** Logo theo language (đổi ảnh nếu cần) */
function getLangLogoSrc(language) {
  switch (language) {
    case 'ENGLISH':
      return '/brand/eng.jpg';
    case 'CHINESE':
      return '/brand/china.jpg';
    default:
      return '/brand/eng.jpg';
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);            // mobile drawer
  const [openDropPosts, setOpenDropPosts] = useState(false); // desktop dropdown
  const dropPostsRef = useRef(null);

  const nav = useNavigate();
  const admin = isAdmin();
  const loggedIn = isLoggedIn();

  // Đọc language hiện tại từ URL để đổi logo/nhãn
  const [searchParams] = useSearchParams();
  const rawLang = (searchParams.get('language') || 'ALL').toUpperCase();
  const language = ['ALL', 'ENGLISH', 'CHINESE'].includes(rawLang) ? rawLang : 'ALL';
  const langLabel =
    language === 'ENGLISH' ? 'Tiếng Anh' :
    language === 'CHINESE' ? 'Tiếng Trung' : 'Tất cả';

  // ESC đóng + khóa cuộn khi mở mobile menu
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setOpenDropPosts(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open]);

  // click ra ngoài để đóng dropdown (desktop)
  useEffect(() => {
    const onClick = (e) => {
      if (!dropPostsRef.current) return;
      if (!dropPostsRef.current.contains(e.target)) setOpenDropPosts(false);
    };
    if (openDropPosts) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openDropPosts]);

  const logout = () => {
    localStorage.removeItem('token');
    nav(0);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <nav className="flex items-center justify-between py-2" aria-label="Main">
            {/* Logo + Brand */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={getLangLogoSrc(language)}
                alt={language === 'ENGLISH' ? 'English' : language === 'CHINESE' ? 'Chinese' : 'All languages'}
                className="h-7 w-7 rounded-md object-cover shadow-sm border border-slate-200"
              />
              <span className="font-extrabold tracking-tight text-slate-800">Deepenyuanben</span>
              <span className="sr-only">Trang chủ</span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-0.5">
              <NavA to="/">Trang chủ</NavA>

              {/* Dropdown: Bài đăng */}
              <div className="relative" ref={dropPostsRef}>
                <button
                  type="button"
                  onClick={() => setOpenDropPosts(v => !v)}
                  className={`nav-item ${openDropPosts ? 'nav-item-active' : ''}`}
                  aria-haspopup="menu"
                  aria-expanded={openDropPosts}
                >
                  Bài đăng — {langLabel}
                  <svg viewBox="0 0 24 24" className={`ml-1 h-4 w-4 transition ${openDropPosts ? 'rotate-180' : ''}`}>
                    <path d="M7 10l5 5 5-5" fill="currentColor" />
                  </svg>
                </button>

                {openDropPosts && (
                  <div role="menu" className="dropdown">
                    <button role="menuitem" className="dropdown-item" onClick={() => gotoHomeLanguage(nav, 'ALL', [setOpenDropPosts])}>
                      Tất cả
                    </button>
                    <button role="menuitem" className="dropdown-item" onClick={() => gotoHomeLanguage(nav, 'ENGLISH', [setOpenDropPosts])}>
                      Tiếng Anh
                    </button>
                    <button role="menuitem" className="dropdown-item" onClick={() => gotoHomeLanguage(nav, 'CHINESE', [setOpenDropPosts])}>
                      Tiếng Trung
                    </button>
                  </div>
                )}
              </div>

              <NavA to="/about">Giới thiệu</NavA>
              <NavA to="/contact">Liên hệ</NavA>

              {admin && <NavA to="/manageLink">Quản lý</NavA>}
              {admin && <Link to="/createLink" className="nav-item">Tạo link</Link>}

              {/* Search icon */}
              <button className="nav-search ml-1" aria-label="Tìm kiếm">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" strokeWidth="2" />
                </svg>
              </button>

              {!loggedIn ? (
                <Link to="/login" className="nav-item ml-1">Đăng nhập</Link>
              ) : (
                <button onClick={logout} className="nav-item ml-1">Đăng xuất</button>
              )}
            </div>

            {/* Mobile toggler */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2"
              onClick={() => setOpen(v => !v)}
              aria-label="Mở menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* ================= MOBILE OVERLAY + DRAWER ================= */}

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-menu"
        className={`
          md:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw]
          bg-white shadow-xl z-50
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          pt-[env(safe-area-inset-top,0px)]
          overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <div className="flex justify-end p-2">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List items */}
        <div className="px-3 pb-6 flex flex-col gap-2">
          <NavA to="/" onClick={() => setOpen(false)} className="w-full block justify-start">
            Trang chủ
          </NavA>

          <button className="nav-item w-full justify-start" onClick={() => gotoHomeLanguage(nav, 'ALL', [setOpen])}>
            Bài đăng – Tất cả
          </button>
          <button className="nav-item w-full justify-start" onClick={() => gotoHomeLanguage(nav, 'ENGLISH', [setOpen])}>
            Bài đăng – Tiếng Anh
          </button>
          <button className="nav-item w-full justify-start" onClick={() => gotoHomeLanguage(nav, 'CHINESE', [setOpen])}>
            Bài đăng – Tiếng Trung
          </button>

          <NavA to="/about" onClick={() => setOpen(false)} className="w-full block justify-start">
            Giới thiệu
          </NavA>
          <NavA to="/contact" onClick={() => setOpen(false)} className="w-full block justify-start">
            Liên hệ
          </NavA>

          {admin && (
            <NavA to="/manageLink" onClick={() => setOpen(false)} className="w-full block justify-start">
              Quản lý
            </NavA>
          )}
          {admin && (
            <Link to="/createLink" className="nav-item w-full justify-start" onClick={() => setOpen(false)}>
              Tạo link
            </Link>
          )}

          {!loggedIn ? (
            <Link to="/login" className="nav-item w-full justify-start" onClick={() => setOpen(false)}>
              Đăng nhập
            </Link>
          ) : (
            <button onClick={() => { setOpen(false); logout(); }} className="nav-item w-full justify-start">
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
