import type { FocusArea } from '../types'

/**
 * Áreas de atuação mostradas em "O que faço", na seção Sobre.
 * Os textos resumem o perfil e o LumiFlow; as tecnologias precisam existir
 * em skills.ts ou em projects.ts (verificado em teste).
 */
export const focusAreas: readonly FocusArea[] = [
  {
    title: 'APIs REST com Spring Boot',
    description:
      'Desenvolvo aplicações backend em Java bem estruturadas, com APIs REST que resolvem problemas reais de negócio.',
    technologies: ['Java', 'Spring Boot', 'APIs REST'],
  },
  {
    title: 'Persistência de dados',
    description:
      'Modelo e acesso dados relacionais com JPA e PostgreSQL, com o esquema do banco versionado por migrações.',
    technologies: ['Spring Data JPA / Hibernate', 'PostgreSQL', 'Flyway'],
  },
  {
    title: 'Segurança e níveis de acesso',
    description:
      'Estudo e aplico autenticação e controle de permissões por perfil de usuário, como no LumiFlow.',
    technologies: ['Spring Security'],
  },
  {
    title: 'Sistemas para a indústria',
    description:
      'A experiência prática em ambiente industrial me ajuda a entender processos operacionais e o que um sistema de gestão precisa resolver.',
    technologies: ['Java', 'Spring Boot', 'Thymeleaf'],
  },
]
