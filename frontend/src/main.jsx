import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import ReactGA from 'react-ga4'

import ThemeProvider from './theme/ThemeProvider'
import DarkModeToggle from './components/DarkModeToggle'

const GA_ID = import.meta.env.VITE_GA_ID

function GAInit() {
  const initedRef = React.useRef(false)
  React.useEffect(() => {
    if (!GA_ID || initedRef.current) return
    ReactGA.initialize(GA_ID)
    initedRef.current = true
  }, [])
  return null
}

function RouteTracker() {
  const location = useLocation()
  const lastPathRef = React.useRef(null)
  React.useEffect(() => {
    if (!GA_ID) return
    const path = location.pathname + location.search + location.hash
    if (lastPathRef.current === path) return
    lastPathRef.current = path
    ReactGA.send({ hitType: 'pageview', page: path, title: document.title || 'page' })
  }, [location])
  return null
}

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GAInit />
        <RouteTracker />

        {/* Nút bật/tắt sáng tối — xuất hiện ở mọi trang */}
        <div className="fixed right-4 bottom-4 z-50">
          <DarkModeToggle />
        </div>

        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

if (import.meta.hot) import.meta.hot.accept()
