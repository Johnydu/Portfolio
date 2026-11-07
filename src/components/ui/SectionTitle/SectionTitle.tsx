import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  label: string
  title: string
  id: string
}

export function SectionTitle({ label, title, id }: SectionTitleProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
    </div>
  )
}
