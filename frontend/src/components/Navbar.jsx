// src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { isAdmin, isLoggedIn } from '../utils/auth';

function NavA({ to, children, onClick, end }) {
  return (
    <NavLink
      to={to}
      end={end ?? to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'nav-item-active' : ''}`
      }
    >
      {children}
    </NavLink>
  );
}

// điều hướng về Home với query language
function gotoHomeLanguage(nav, lang, closeFns = []) {
  const qs = new URLSearchParams();
  if (lang && lang !== 'ALL') qs.set('language', lang);
  nav(`/${qs.toString() ? `?${qs}` : ''}`);
  closeFns.forEach((fn) => fn && fn(false));
}

// Logo theo language
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
  const [open, setOpen] = useState(false);
  const [openDropPosts, setOpenDropPosts] = useState(false);
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

  // click ra ngoài để đóng dropdown
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
      {/* thanh nền bo nhẹ đúng mock */}
      <div className="bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <nav className="flex items-center justify-between py-2" aria-label="Main">
            {/* LOGO BÊN TRÁI + chữ thương hiệu */}
            <Link to="/" className="flex items-center gap-2">
              {/* LOGO: dùng <img>, không dùng <span> nữa */}
              <img
                src={getLangLogoSrc(language)}
                alt={language === 'ENGLISH' ? 'English' : language === 'CHINESE' ? 'Chinese' : 'All languages'}
                className="h-7 w-7 rounded-md object-cover shadow-sm border border-slate-200"
              // Nếu deploy dưới subpath, đổi src thành:
              // src={`${import.meta.env.BASE_URL}${getLangLogoSrc(language).replace(/^\//,'')}`}
              />
              <span className="font-extrabold tracking-tight text-slate-800">Deepenyuanben</span>
              <span className="sr-only">Trang chủ</span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-0.5">
              <NavA to="/">Trang chủ</NavA>

              {/* Dropdown Bài đăng */}
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
                    <button
                      role="menuitem"
                      className="dropdown-item"
                      onClick={() => gotoHomeLanguage(nav, 'ALL', [setOpenDropPosts])}
                    >
                      Tất cả
                    </button>
                    <button
                      role="menuitem"
                      className="dropdown-item"
                      onClick={() => gotoHomeLanguage(nav, 'ENGLISH', [setOpenDropPosts])}
                    >
                      Tiếng Anh
                    </button>
                    <button
                      role="menuitem"
                      className="dropdown-item"
                      onClick={() => gotoHomeLanguage(nav, 'CHINESE', [setOpenDropPosts])}
                    >
                      Tiếng Trung
                    </button>
                  </div>
                )}
              </div>

              <NavA to="/about">Giới thiệu</NavA>
              <NavA to="/contact">Liên hệ</NavA>

              {admin && <NavA to="/manageLink">Quản lý</NavA>}
              {admin && <Link to="/createLink" className="nav-item">Tạo link</Link>}

              {/* Search icon tròn như mock */}
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

          {/* Mobile overlay */}
          {open && <div className="md:hidden fixed inset-0 bg-black/20" onClick={() => setOpen(false)} />}

          {/* Mobile menu */}
          <div
            id="mobile-menu"
            className={`md:hidden border-t border-slate-200 px-3 pb-4 pt-2 space-y-1 ${open ? 'block' : 'hidden'}`}
          >
            <NavA to="/" onClick={() => setOpen(false)}>Trang chủ</NavA>

            {/* Lọc theo ngôn ngữ */}
            <button className="nav-item" onClick={() => gotoHomeLanguage(nav, 'ALL', [setOpen])}>
              Bài đăng – Tất cả
            </button>
            <button className="nav-item" onClick={() => gotoHomeLanguage(nav, 'ENGLISH', [setOpen])}>
              Bài đăng – Tiếng Anh
            </button>
            <button className="nav-item" onClick={() => gotoHomeLanguage(nav, 'CHINESE', [setOpen])}>
              Bài đăng – Tiếng Trung
            </button>

            <NavA to="/about" onClick={() => setOpen(false)}>Giới thiệu</NavA>
            <NavA to="/contact" onClick={() => setOpen(false)}>Liên hệ</NavA>

            {admin && <NavA to="/manageLink" onClick={() => setOpen(false)}>Quản lý</NavA>}
            {admin && (
              <Link to="/createLink" className="nav-item" onClick={() => setOpen(false)}>
                Tạo link
              </Link>
            )}

            {!loggedIn ? (
              <Link to="/login" className="nav-item" onClick={() => setOpen(false)}>Đăng nhập</Link>
            ) : (
              <button onClick={() => { setOpen(false); logout(); }} className="nav-item">Đăng xuất</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
