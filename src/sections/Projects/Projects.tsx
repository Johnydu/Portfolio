import { Section } from '../../components/layout'
import { SectionTitle } from '../../components/ui'
import { projects } from '../../data/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectShowcase } from './ProjectShowcase'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <Section id="projetos" titleId="titulo-projetos">
      <SectionTitle
        label="03 / projetos"
        title="Projetos"
        id="titulo-projetos"
      />
      <div className={styles.grid}>
        {projects.map((project) => (
          <div
            key={project.title}
            className={project.featured ? styles.featured : undefined}
          >
            {project.featured && project.showcase ? (
              <ProjectShowcase project={project} />
            ) : (
              <ProjectCard project={project} />
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
