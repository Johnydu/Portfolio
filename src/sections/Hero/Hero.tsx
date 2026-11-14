import { Section } from '../../components/layout'
import { Button, TerminalLine } from '../../components/ui'
import { profile } from '../../data/profile'
import styles from './Hero.module.css'

function Statement() {
  const { statement, statementHighlight } = profile
  const start = statement.indexOf(statementHighlight)
  if (start === -1 || statementHighlight === '') return <>{statement}</>
  const end = start + statementHighlight.length
  return (
    <>
      {statement.slice(0, start)}
      <span className={styles.highlight}>{statementHighlight}</span>
      {statement.slice(end)}
    </>
  )
}

export function Hero() {
  return (
    <Section id="inicio" titleId="titulo-hero">
      <div className={`${styles.layout} fade-in`}>
        <div className={styles.content}>
          <TerminalLine text={profile.terminal} />
          <h1 id="titulo-hero" className={styles.name}>
            {profile.name}
          </h1>
          <p className={styles.statement}>
            <Statement />
          </p>
          <div className={styles.actions}>
            <Button href="#projetos" variant="primary">
              Ver projetos
            </Button>
            <Button href={profile.links.linkedin} external variant="secondary">
              LinkedIn
            </Button>
          </div>
          <p className={styles.tagline}>{profile.tagline}</p>
          <p className={styles.location}>{profile.location}</p>
        </div>
        <div className={styles.frame}>
          <img
            className={styles.photo}
            src={profile.photo.src}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            fetchPriority="high"
            decoding="async"
          />
          <span className={styles.dimension} aria-hidden="true">
            {profile.photo.width} px
          </span>
        </div>
      </div>
    </Section>
  )
}
