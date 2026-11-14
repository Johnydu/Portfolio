import { Section } from '../../components/layout'
import { SectionTitle } from '../../components/ui'
import { projects } from '../../data/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectShowcase } from './ProjectShowcase'
import styles from './Projects.module.css'

export function Projects() {
  // Só as vitrines entram na alternância: a primeira fica com a mídia à esquerda.
  const vitrines = projects.filter((project) => project.showcase)

  return (
    <Section id="projetos" titleId="titulo-projetos">
      <div className={styles.secao}>
        <SectionTitle
          label="03 / projetos"
          title="Projetos"
          id="titulo-projetos"
        />
        <div className={styles.grid}>
          {projects.map((project) => {
            if (!project.showcase) {
              return (
                <div key={project.title}>
                  <ProjectCard project={project} />
                </div>
              )
            }
            const reverso = vitrines.indexOf(project) % 2 === 1
            return (
              <div key={project.title} className={styles.featured}>
                <ProjectShowcase project={project} reverso={reverso} />
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
