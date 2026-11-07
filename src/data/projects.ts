import type { Project } from '../types'

export const projects: readonly Project[] = [
  {
    title: 'LumiFlow',
    description:
      'Sistema web de gestão da produção industrial para organizar e acompanhar processos em ambiente fabril. Nasceu de uma necessidade real observada no contexto industrial e está em evolução e validação em ambiente real.',
    technologies: [
      'Java 21',
      'Spring Boot 3',
      'Spring Data JPA',
      'Hibernate',
      'Spring Security',
      'PostgreSQL',
      'Flyway',
      'Thymeleaf',
      'HTML5',
      'CSS3',
      'Maven',
      'Git',
    ],
    highlights: [
      'Usuários e níveis de acesso',
      'Cadastro de produtos, máquinas e setores',
      'Roteiros de produção',
      'Ordens de produção e acompanhamento das etapas',
      'Registros e histórico das operações',
    ],
    repoUrl: 'https://github.com/Johnydu/LumiFlow',
    featured: true,
  },
  {
    title: 'landing-page',
    description:
      'Landing page responsiva para divulgação de uma academia de karatê, desenvolvida com HTML5 e CSS3.',
    technologies: ['HTML5', 'CSS3'],
    repoUrl: 'https://github.com/Johnydu/landing-page',
  },
]
