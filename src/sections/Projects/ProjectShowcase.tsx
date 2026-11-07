import { Button, Tag } from '../../components/ui'
import type { Project } from '../../types'
import styles from './ProjectShowcase.module.css'

export function ProjectShowcase({ project }: { project: Project }) {
  const { showcase } = project

  return (
    <article className={styles.showcase}>
      {showcase && (
        <figure className={styles.media}>
          <img
            className={styles.shot}
            src={showcase.media.src}
            alt={showcase.media.alt}
            width={showcase.media.width}
            height={showcase.media.height}
            loading="lazy"
            decoding="async"
          />
          <img
            className={styles.mark}
            src={showcase.logo.src}
            alt={showcase.logo.alt}
            width={showcase.logo.width}
            height={showcase.logo.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      <div className={styles.body}>
        <p className={styles.eyebrow}>Projeto em destaque</p>
        <div className={styles.brand}>
          {showcase && (
            <img
              className={styles.logo}
              src={showcase.logo.src}
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
          <Button href={project.repoUrl} external variant="primary">
            Repositório
            <span className={styles.srOnly}> do projeto {project.title}</span>
          </Button>
          {project.demoUrl && (
            <Button href={project.demoUrl} external variant="secondary">
              Demonstração
              <span className={styles.srOnly}> do projeto {project.title}</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
