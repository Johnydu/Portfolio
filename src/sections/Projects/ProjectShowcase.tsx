import { Button, Tag } from '../../components/ui'
import { profile } from '../../data/profile'
import type { Project } from '../../types'
import { ImageCarousel } from './ImageCarousel'
import styles from './ProjectShowcase.module.css'

export function ProjectShowcase({ project }: { project: Project }) {
  const { showcase } = project
  const logo = showcase?.logo
  const gallery = showcase?.gallery
  const media = gallery ? undefined : showcase?.media
  const classes = [
    styles.showcase,
    project.featured ? styles.featured : '',
    gallery ? styles.withGallery : '',
  ]
    .filter(Boolean)
    .join(' ')
  const shotClass =
    showcase?.focus === 'start'
      ? `${styles.shot} ${styles.shotStart}`
      : styles.shot

  return (
    <article className={classes}>
      <div className={styles.layout}>
        {gallery && (
          <div className={styles.gallery}>
            <ImageCarousel
              images={gallery}
              label={`Imagens do ${project.title}`}
            />
          </div>
        )}
        {media && (
          <figure className={styles.media}>
            <img
              className={shotClass}
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
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
          {(project.featured || project.commercial) && (
            <div className={styles.labels}>
              {project.featured && (
                <p className={styles.eyebrow}>Projeto em destaque</p>
              )}
              {project.commercial && (
                <p className={styles.badge}>Produto comercial</p>
              )}
            </div>
          )}
          <div className={styles.brand}>
            {logo && (
              <img
                className={styles.logo}
                src={logo.src}
                alt={media ? '' : logo.alt}
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
            {project.commercial && (
              <Button href={profile.links.linkedin} external variant="primary">
                Solicitar demonstração
                <span className={styles.srOnly}> do {project.title}</span>
              </Button>
            )}
            {project.repoUrl && (
              <Button
                href={project.repoUrl}
                external
                variant={project.featured ? 'primary' : 'secondary'}
              >
                Repositório
                <span className={styles.srOnly}>
                  {' '}
                  do projeto {project.title}
                </span>
              </Button>
            )}
            {project.demoUrl && (
              <Button href={project.demoUrl} external variant="primary">
                Ver página
                <span className={styles.srOnly}>
                  {' '}
                  do projeto {project.title}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
