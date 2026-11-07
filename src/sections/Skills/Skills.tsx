import { Section } from '../../components/layout'
import { SectionTitle, Tag } from '../../components/ui'
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
      <div className={styles.groups}>
        {skills.map((group) => (
          <div key={group.level} className={styles.group}>
            <h3 className={styles.level}>{group.level}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
