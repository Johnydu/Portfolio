import { Section } from '../../components/layout'
import { SectionTitle } from '../../components/ui'
import { timeline } from '../../data/experience'
import styles from './Timeline.module.css'

export function Timeline() {
  return (
    <Section id="trajetoria" titleId="titulo-trajetoria">
      <SectionTitle
        label="04 / trajetória"
        title="Experiência e formação"
        id="titulo-trajetoria"
      />
      <ol className={styles.list}>
        {timeline.map((item) => (
          <li key={item.organization} className={styles.item}>
            <p className={styles.period}>{item.period}</p>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.organization}>{item.organization}</p>
            <p className={styles.description}>{item.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
