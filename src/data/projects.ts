import landingMedia from '../assets/landing-page/hero.webp'
import lumiflowMedia from '../assets/lumiflow/fundo.webp'
import lumiflowLogo from '../assets/lumiflow/logo.webp'
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
    commercial: true,
    featured: true,
    showcase: {
      logo: {
        src: lumiflowLogo,
        alt: 'Logo do LumiFlow',
        width: 384,
        height: 367,
      },
      media: { src: lumiflowMedia, alt: '', width: 1200, height: 800 },
    },
  },
  {
    title: 'landing-page',
    description:
      'Landing page responsiva para divulgação de uma academia de karatê, desenvolvida com HTML5 e CSS3.',
    technologies: ['HTML5', 'CSS3'],
    repoUrl: 'https://github.com/Johnydu/landing-page',
    demoUrl: 'https://johnydu.github.io/landing-page/',
    showcase: {
      media: {
        src: landingMedia,
        alt: 'Captura da tela inicial da landing page Bushido Karatê, com o título “Disciplina que transforma vidas.” e um ensō vermelho em volta de 空手道',
        width: 1200,
        height: 660,
      },
    },
  },
]
