import { profile } from '../../../data/profile'
import styles from './Footer.module.css'

const socialLinks = [
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'GitHub', href: profile.links.github },
  { label: 'Instagram', href: profile.links.instagram },
] as const

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.name}>{profile.name}</p>
          <p className={styles.muted}>{profile.headline}</p>
        </div>
        <ul className={styles.links}>
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <span className={styles.srOnly}> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.muted}>
          © {new Date().getFullYear()} {profile.name}. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}
