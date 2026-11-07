import { Section } from '../../components/layout'
import { SectionTitle } from '../../components/ui'
import { profile } from '../../data/profile'
import styles from './About.module.css'

export function About() {
  return (
    <Section id="sobre" titleId="titulo-sobre">
      <SectionTitle label="01 / sobre" title="Sobre mim" id="titulo-sobre" />
      <div className={styles.text}>
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.ai}>
        <h3 className={styles.aiTitle}>IA aplicada ao desenvolvimento</h3>
        <p>{profile.aiNote}</p>
      </div>
    </Section>
  )
}
