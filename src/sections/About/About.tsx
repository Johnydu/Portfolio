import { Section } from '../../components/layout'
import { SectionTitle, Tag } from '../../components/ui'
import { focusAreas } from '../../data/focusAreas'
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
      <div className={styles.focus}>
        <h3 id="titulo-o-que-faco" className={styles.focusTitle}>
          O que faço
        </h3>
        <ul className={styles.focusList} aria-labelledby="titulo-o-que-faco">
          {focusAreas.map((area, index) => (
            <li key={area.title} className={styles.focusItem}>
              <p className={styles.focusNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h4 className={styles.focusItemTitle}>{area.title}</h4>
              <p className={styles.focusDescription}>{area.description}</p>
              <ul className={styles.focusTags}>
                {area.technologies.map((technology) => (
                  <li key={technology}>
                    <Tag>{technology}</Tag>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.ai}>
        <h3 className={styles.aiTitle}>IA aplicada ao desenvolvimento</h3>
        <p>{profile.aiNote}</p>
      </div>
    </Section>
  )
}
