import type { ReactNode } from 'react'
import { Reveal } from '../../ui/Reveal/Reveal'
import styles from './Section.module.css'

interface SectionProps {
  id: string
  titleId: string
  children: ReactNode
}

export function Section({ id, titleId, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={titleId} className={styles.section}>
      <Reveal>{children}</Reveal>
    </section>
  )
}
