import { describe, expect, it } from 'vitest'
import { isHttpsUrl } from './isHttpsUrl'
import { timeline } from './experience'
import { profile } from './profile'
import { projects } from './projects'
import { skills } from './skills'

describe('dados do portfólio', () => {
  it('todo projeto tem ao menos uma tecnologia e, se tiver repoUrl, ela é https', () => {
    expect(projects.length).toBeGreaterThan(0)
    for (const project of projects) {
      if (project.repoUrl) expect(isHttpsUrl(project.repoUrl)).toBe(true)
      expect(project.technologies.length).toBeGreaterThan(0)
    }
  })

  it('o LumiFlow é um produto comercial e não aponta para o código privado', () => {
    const lumiflow = projects.find((project) => project.title === 'LumiFlow')
    expect(lumiflow?.commercial).toBe(true)
    expect(lumiflow?.repoUrl).toBeUndefined()
    expect(JSON.stringify(projects)).not.toContain(
      'github.com/Johnydu/LumiFlow',
    )
  })

  it('todo link externo usa https', () => {
    const urls = [
      ...Object.values(profile.links),
      ...(profile.resumeUrl ? [profile.resumeUrl] : []),
      ...projects.flatMap((p) => [
        ...(p.repoUrl ? [p.repoUrl] : []),
        ...(p.demoUrl ? [p.demoUrl] : []),
      ]),
    ]
    expect(urls.length).toBeGreaterThanOrEqual(5)
    for (const url of urls) {
      expect(isHttpsUrl(url), url).toBe(true)
    }
  })

  it('os níveis de habilidade são os três definidos, sem porcentagens', () => {
    expect(skills.map((group) => group.level)).toEqual([
      'Foco principal',
      'Em aprofundamento',
      'Fundamentos',
    ])
    for (const item of skills.flatMap((group) => group.items)) {
      expect(item).not.toContain('%')
    }
  })

  it('Java e Spring Boot estão em Foco principal', () => {
    const principal = skills.find((group) => group.level === 'Foco principal')
    expect(principal?.items).toEqual(['Java', 'Spring Boot'])
  })

  it('o LumiFlow é o projeto em destaque e a landing-page é secundária', () => {
    const featured = projects.filter((project) => project.featured)
    expect(featured.map((project) => project.title)).toEqual(['LumiFlow'])
    expect(projects.map((project) => project.title)).toContain('landing-page')
  })

  it('a linha do tempo tem RBL Iluminação e UNIRP', () => {
    const organizations = timeline.map((item) => item.organization)
    expect(organizations.some((o) => o.includes('RBL Iluminação'))).toBe(true)
    expect(organizations.some((o) => o.includes('UNIRP'))).toBe(true)
  })

  it('o perfil não expõe e-mail', () => {
    expect(JSON.stringify(profile)).not.toMatch(/mailto:|@gmail\.com/i)
  })
})
