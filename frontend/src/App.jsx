// src/App.jsx
import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import GlobalLoader from './components/GlobalLoader'
import RequireAdmin from './components/RequireAdmin'
import Footer from './components/Footer'
import { initAuthWatch } from './utils/auth'
// Lazy pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const CreatePost = lazy(() => import('./pages/CreatePost'))
const Login = lazy(() => import('./pages/Login'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const ManagePosts = lazy(() => import('./pages/ManagePosts'))
const EditPost = lazy(() => import('./pages/EditPost'))
const Library = lazy(() => import('./pages/Library')) // <— thêm dòng này
const ManageLinks = lazy(() => import('./pages/ManageLinks'));
const CreateLink = lazy(() => import('./pages/CreateLink'));
const EditLink = lazy(() => import('./pages/EditLink'));
const LinkDetail = lazy(() => import('./pages/LinkDetail'));

export default function App() {
  useEffect(() => {
    const cleanup = initAuthWatch()
    return cleanup
  }, [])
  return (
    // Layout toàn trang: footer luôn dính đáy
    <div className="min-h-screen flex flex-col">
      {/* Nội dung chiếm phần còn lại */}
      <div className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Navbar />

          {/* Overlay loading toàn cục khi có request API */}
          <GlobalLoader />

          {/* Loader khi đang lazy-load page */}
          <Suspense
            fallback={
              <div className="py-24 text-center text-slate-500">
                <div className="mx-auto mb-3 h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                Đang tải trang…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route
                path="/create"
                element={<RequireAdmin><CreatePost /></RequireAdmin>}
              />
              <Route path="/login" element={<Login />} />

              {/* Đồng bộ với Link trong PostCard/FeaturedPost */}
              <Route path="/posts/:id" element={<PostDetail />} />

              <Route
                path="/manage"
                element={<RequireAdmin><ManagePosts /></RequireAdmin>}
              />
              <Route
                path="/edit/:id"
                element={<RequireAdmin><EditPost /></RequireAdmin>}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/library" element={<Library />} />
              <Route path="/manageLink" element={<RequireAdmin><ManageLinks /></RequireAdmin>} />
              <Route path="/createLink" element={<RequireAdmin><CreateLink /></RequireAdmin>} />
              <Route path="/editLink/:id" element={<RequireAdmin><EditLink /></RequireAdmin>} />
              <Route path="/links/:id" element={<LinkDetail />} />
            </Routes>
          </Suspense>
        </div>
      </div>

      {/* Footer cố định dưới cùng */}
      <Footer />
    </div>
  )
}
