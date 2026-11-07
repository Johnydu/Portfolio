import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  featured?: boolean
}

export function Card({ children, featured = false }: CardProps) {
  const className = featured ? `${styles.card} ${styles.featured}` : styles.card
  return <article className={className}>{children}</article>
}
