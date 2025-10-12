import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrollTop = h.scrollTop || document.body.scrollTop
      const height = (h.scrollHeight - h.clientHeight) || 1
      setProgress(Math.min(100, Math.round((scrollTop / height) * 100)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-slate-200/60">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
