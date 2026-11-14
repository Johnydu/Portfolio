import { iconsBySlug, skillIcons } from '../../../data/skillIcons'
import styles from './TechIcon.module.css'

interface TechIconProps {
  name: string
}

function initialsOf(name: string): string {
  const words = name.split(/[\s/]+/).filter(Boolean)
  const letters =
    words.length > 1
      ? words.slice(0, 2).map((w) => w[0])
      : [...(words[0] ?? '')].slice(0, 2)
  return letters.join('')
}

export function TechIcon({ name }: TechIconProps) {
  const slug = skillIcons[name]
  const icon = slug ? iconsBySlug[slug] : undefined

  if (!icon) {
    return (
      <span className={`${styles.icon} ${styles.initials}`} aria-hidden="true">
        {initialsOf(name)}
      </span>
    )
  }
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  )
}
