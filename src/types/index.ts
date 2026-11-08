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
  /** Logo do projeto, ao lado do título e sobre a mídia. */
  logo: ProjectImage
  /** Imagem grande da vitrine; decorativa, use alt vazio. */
  media: ProjectImage
}

export interface Project {
  title: string
  description: string
  technologies: readonly string[]
  repoUrl: string
  demoUrl?: string
  featured?: boolean
  highlights?: readonly string[]
  /** Imagens da vitrine; só o projeto em destaque usa. */
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
  /** Foto espontânea da seção Sobre mim. */
  aboutPhoto: {
    src: string
    alt: string
    width: number
    height: number
  }
}
