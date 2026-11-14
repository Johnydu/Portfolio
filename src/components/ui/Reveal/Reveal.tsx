import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'
import styles from './Reveal.module.css'

interface RevealProps {
  children: ReactNode
}

function startsVisible(): boolean {
  if (typeof IntersectionObserver === 'undefined') return true
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(startsVisible)

  useEffect(() => {
    const element = ref.current
    if (visible || !element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          flushSync(() => setVisible(true))
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [visible])

  const className = visible ? `${styles.reveal} visible` : styles.reveal
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
