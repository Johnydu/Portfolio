import { Section } from '../../components/layout'
import { SectionTitle, TechIcon } from '../../components/ui'
import { skills } from '../../data/skills'
import styles from './Skills.module.css'

export function Skills() {
  return (
    <Section id="tecnologias" titleId="titulo-tecnologias">
      <SectionTitle
        label="02 / tecnologias"
        title="Tecnologias"
        id="titulo-tecnologias"
      />
      <div className={styles.diagram}>
        <div className={styles.core}>
          <span className={styles.coreText}>Backend Java</span>
          <span className={styles.trunk} aria-hidden="true" />
        </div>
        <div className={styles.groups}>
          {skills.map((group) => (
            <section key={group.level} className={styles.group}>
              <span className={styles.line} aria-hidden="true" />
              <h3 className={styles.level}>{group.level}</h3>
              <ul className={styles.items}>
                {group.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <TechIcon name={item} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Section>
  )
}
