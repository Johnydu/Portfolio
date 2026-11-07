import { Section } from '../../components/layout'
import { Button } from '../../components/ui'
import { profile } from '../../data/profile'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <Section id="inicio" titleId="titulo-hero">
      <div className={`${styles.content} fade-in`}>
        <p className={styles.headline}>{profile.headline}</p>
        <h1 id="titulo-hero" className={styles.name}>
          {profile.name}
        </h1>
        <p className={styles.tagline}>{profile.tagline}</p>
        <p className={styles.location}>{profile.location}</p>
        <div className={styles.actions}>
          <Button href={profile.links.linkedin} external variant="primary">
            LinkedIn
          </Button>
          <Button href={profile.links.github} external variant="secondary">
            GitHub
          </Button>
        </div>
      </div>
    </Section>
  )
}
