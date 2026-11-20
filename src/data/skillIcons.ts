import {
  siApachemaven,
  siBootstrap,
  siClaude,
  siCss,
  siFlyway,
  siGit,
  siGithub,
  siHibernate,
  siHtml5,
  siIntellijidea,
  siJavascript,
  siMysql,
  siPostgresql,
  siReact,
  siSpringboot,
  siSpringsecurity,
  siThymeleaf,
  siTypescript,
} from 'simple-icons'

export interface SimpleIcon {
  title: string
  slug: string
  path: string
}

/** Slug do Simple Icons → desenho. Só os ícones usados entram no build. */
export const iconsBySlug: Readonly<Record<string, SimpleIcon>> = {
  apachemaven: siApachemaven,
  bootstrap: siBootstrap,
  claude: siClaude,
  css: siCss,
  flyway: siFlyway,
  git: siGit,
  github: siGithub,
  hibernate: siHibernate,
  html5: siHtml5,
  intellijidea: siIntellijidea,
  javascript: siJavascript,
  mysql: siMysql,
  postgresql: siPostgresql,
  react: siReact,
  springboot: siSpringboot,
  springsecurity: siSpringsecurity,
  thymeleaf: siThymeleaf,
  typescript: siTypescript,
}

/**
 * Nome da tecnologia (como em skills.ts) → slug do Simple Icons.
 * Fora do mapa (ex.: Java, sem logotipo no pacote) o item mostra iniciais.
 */
export const skillIcons: Readonly<Record<string, string>> = {
  'Spring Boot': 'springboot',
  'Spring Data JPA / Hibernate': 'hibernate',
  'Spring Security': 'springsecurity',
  PostgreSQL: 'postgresql',
  TypeScript: 'typescript',
  React: 'react',
  HTML5: 'html5',
  CSS3: 'css',
  JavaScript: 'javascript',
  Thymeleaf: 'thymeleaf',
  Bootstrap: 'bootstrap',
  Flyway: 'flyway',
  Maven: 'apachemaven',
  MySQL: 'mysql',
  Git: 'git',
  GitHub: 'github',
  'IntelliJ IDEA': 'intellijidea',
  'Claude Code': 'claude',
}
