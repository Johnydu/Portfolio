import { useEffect, useState } from 'react'
import styles from './TerminalLine.module.css'

const TYPING_INTERVAL_MS = 45

interface TerminalLineProps {
  text: string
}

function prefersReducedMotion(): boolean {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function TerminalLine({ text }: TerminalLineProps) {
  const [shown, setShown] = useState(() =>
    prefersReducedMotion() ? text.length : 0,
  )

  useEffect(() => {
    if (shown >= text.length) return
    const timer = setInterval(() => {
      setShown((count) => {
        const next = count + 1
        if (next >= text.length) clearInterval(timer)
        return next
      })
    }, TYPING_INTERVAL_MS)
    return () => clearInterval(timer)
    // Só recomeça quando o texto muda; `shown` não deve recriar o temporizador.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <p className={styles.terminal}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{`> ${text.slice(0, shown)}`}</span>
      <span aria-hidden="true" className={styles.cursor} />
    </p>
  )
}
