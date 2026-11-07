import { Button, Tag } from '../../ui'
import { profile } from '../../../data/profile'
import styles from './ProfileCard.module.css'

const [role, ...stack] = profile.headline.split('|').map((part) => part.trim())

const socialLinks = [
  { label: 'LinkedIn', href: profile.links.linkedin, variant: 'primary' },
  { label: 'GitHub', href: profile.links.github, variant: 'secondary' },
  { label: 'Instagram', href: profile.links.instagram, variant: 'secondary' },
] as const

export function ProfileCard() {
  return (
    <aside className={styles.card} aria-label="Perfil">
      <img
        className={styles.photo}
        src={profile.photo.src}
        alt={profile.photo.alt}
        width={profile.photo.width}
        height={profile.photo.height}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.identity}>
        <p className={styles.name}>{profile.name}</p>
        <p className={styles.role}>{role}</p>
        <ul className={styles.stack}>
          {stack.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      </div>
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>Localização</dt>
          <dd>{profile.location}</dd>
        </div>
        <div className={styles.fact}>
          <dt>Disponibilidade</dt>
          <dd>{profile.tagline}</dd>
        </div>
      </dl>
      <ul className={styles.links}>
        {socialLinks.map((link) => (
          <li key={link.label}>
            <Button href={link.href} external variant={link.variant}>
              {link.label}
            </Button>
          </li>
        ))}
        {profile.resumeUrl && (
          <li>
            <Button href={profile.resumeUrl} external variant="secondary">
              Currículo em PDF
            </Button>
          </li>
        )}
      </ul>
    </aside>
  )
}
