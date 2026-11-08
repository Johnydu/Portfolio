export type SkillLevel = 'Foco principal' | 'Em aprofundamento' | 'Fundamentos'

export interface SkillGroup {
  level: SkillLevel
  items: readonly string[]
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface ProjectShowcase {
  /** Logo do projeto, ao lado do título e sobre a mídia. Opcional. */
  logo?: ProjectImage
  /**
   * Imagem do banner. Use alt vazio quando for decorativa (fundo com logo);
   * descreva-a quando for uma captura de tela do projeto.
   */
  media: ProjectImage
  /** Lado da imagem que fica visível quando o banner corta. Padrão: center. */
  focus?: 'center' | 'start'
}

export interface Project {
  title: string
  description: string
  technologies: readonly string[]
  repoUrl: string
  demoUrl?: string
  featured?: boolean
  highlights?: readonly string[]
  /** Banner da vitrine; com ele o projeto é mostrado como ProjectShowcase. */
  showcase?: ProjectShowcase
}

export interface FocusArea {
  title: string
  description: string
  technologies: readonly string[]
}

export interface TimelineItem {
  title: string
  organization: string
  period: string
  description: string
}

export interface Profile {
  name: string
  headline: string
  location: string
  tagline: string
  photo: {
    src: string
    alt: string
    width: number
    height: number
  }
  about: readonly string[]
  aiNote: string
  links: {
    linkedin: string
    github: string
    instagram: string
  }
  resumeUrl?: string
  /** Foto da seção Contato. */
  contactPhoto: {
    src: string
    alt: string
    width: number
    height: number
  }
  /** Foto espontânea da seção Sobre mim. */
  aboutPhoto: {
    src: string
    alt: string
    width: number
    height: number
  }
}
