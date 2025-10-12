import { Link } from 'react-router-dom';
import { getDomain } from '../utils/url';

export default function SidebarList({ title = 'Sử Việt', items = [] }) {
  return (
    <aside className="space-y-3">
      <h2 className="text-2xl font-extrabold border-b-4 border-red-500 pb-1">{title}</h2>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-3">
            {it.thumbnail ? (
              <img
                src={it.thumbnail}
                alt={it.title}
                className="w-16 h-16 object-cover rounded-md border"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-md border bg-gray-100 dark:bg-neutral-800" />
            )}
            <div className="min-w-0">
              <Link
                to={`/links/${it.id}`}
                className="line-clamp-2 font-medium hover:text-blue-600"
                title={it.title}
              >
                {it.title}
              </Link>
              <div className="text-xs text-gray-500">
                {getDomain(it.url || '')}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
