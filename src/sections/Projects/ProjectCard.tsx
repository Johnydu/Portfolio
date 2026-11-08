import { Button, Card, Tag } from '../../components/ui'
import type { Project } from '../../types'
import styles from './Projects.module.css'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card featured={project.featured}>
      <h3 className={styles.title}>{project.title}</h3>
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
        {project.repoUrl && (
          <Button href={project.repoUrl} external variant="secondary">
            Repositório
            <span className={styles.srOnly}> do projeto {project.title}</span>
          </Button>
        )}
        {project.demoUrl && (
          <Button href={project.demoUrl} external variant="primary">
            Demonstração
            <span className={styles.srOnly}> do projeto {project.title}</span>
          </Button>
        )}
      </div>
    </Card>
  )
}
