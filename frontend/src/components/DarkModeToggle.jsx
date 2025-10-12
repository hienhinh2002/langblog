import { useTheme } from '../theme/ThemeProvider';

const Sun = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props}>
    <path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10-9h-2v3h2V4zm7.04 1.46l-1.41-1.41-1.8 1.79 1.42 1.42 1.79-1.8zM12 6a6 6 0 100 12 6 6 0 000-12zm8 5v2h3v-2h-3zM4.96 18.54l1.41 1.41 1.8-1.79-1.42-1.42-1.79 1.8zM18 20h-2v3h2v-3zm-8 0H8v3h2v-3z"/>
  </svg>
);

const Moon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props}>
    <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

export default function DarkModeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border bg-white/70 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-800 dark:border-neutral-700 ${className}`}
      aria-label="Bật/tắt chế độ tối"
      title={isDark ? 'Chuyển sáng' : 'Chuyển tối'}
    >
      {isDark ? <Sun/> : <Moon/>}
      <span className="text-sm hidden sm:inline">{isDark ? 'Sáng' : 'Tối'}</span>
    </button>
  );
}
