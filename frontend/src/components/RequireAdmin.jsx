// src/components/RequireAdmin.jsx
import { Navigate, useLocation } from 'react-router-dom'

// Nếu bạn đã làm utils/auth.js thì import:
// import { isAdmin } from '../utils/auth'

// Bản tự chứa (không cần utils):
const isAdmin = () => {
  try {
    const t = localStorage.getItem('token')
    if (!t) return false
    const p = JSON.parse(atob(t.split('.')[1])) // decode JWT payload
    const role = p?.role || p?.authorities?.[0]?.authority
    return role === 'ROLE_ADMIN' || role === 'ADMIN'
  } catch { return false }
}

export default function RequireAdmin({ children }) {
  const loc = useLocation()
  if (!isAdmin()) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}
