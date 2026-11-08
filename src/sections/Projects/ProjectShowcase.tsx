import { Button, Tag } from '../../components/ui'
import type { Project } from '../../types'
import styles from './ProjectShowcase.module.css'

export function ProjectShowcase({ project }: { project: Project }) {
  const { showcase } = project
  const logo = showcase?.logo
  const shotClass =
    showcase?.focus === 'start'
      ? `${styles.shot} ${styles.shotStart}`
      : styles.shot

  return (
    <article
      className={
        project.featured
          ? `${styles.showcase} ${styles.featured}`
          : styles.showcase
      }
    >
      {showcase && (
        <figure className={styles.media}>
          <img
            className={shotClass}
            src={showcase.media.src}
            alt={showcase.media.alt}
            width={showcase.media.width}
            height={showcase.media.height}
            loading="lazy"
            decoding="async"
          />
          {logo && (
            <img
              className={styles.mark}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              decoding="async"
            />
          )}
        </figure>
      )}
      <div className={styles.body}>
        {project.featured && (
          <p className={styles.eyebrow}>Projeto em destaque</p>
        )}
        <div className={styles.brand}>
          {logo && (
            <img
              className={styles.logo}
              src={logo.src}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
            />
          )}
          <h3 className={styles.title}>{project.title}</h3>
        </div>
        <p className={styles.description}>{project.description}</p>
        {project.highlights && (
          <ul className={styles.highlights}>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
        <ul className={styles.tags}>
          {project.technologies.map((technology) => (
            <li key={technology}>
              <Tag>{technology}</Tag>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button
            href={project.repoUrl}
            external
            variant={project.featured ? 'primary' : 'secondary'}
          >
            Repositório
            <span className={styles.srOnly}> do projeto {project.title}</span>
          </Button>
          {project.demoUrl && (
            <Button href={project.demoUrl} external variant="primary">
              Ver página
              <span className={styles.srOnly}> do projeto {project.title}</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
