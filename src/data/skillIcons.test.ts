import { describe, expect, it } from 'vitest'
import * as simpleIcons from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import { iconsBySlug, skillIcons } from './skillIcons'
import { skills } from './skills'

const all = Object.values(simpleIcons).filter(
  (v): v is SimpleIcon =>
    typeof v === 'object' && v !== null && 'slug' in v && 'path' in v,
)

describe('skillIcons', () => {
  it('todo slug do mapa existe no pacote simple-icons', () => {
    for (const slug of Object.values(skillIcons)) {
      expect(
        all.some((i) => i.slug === slug),
        slug,
      ).toBe(true)
      expect(iconsBySlug[slug], slug).toBeDefined()
    }
  })

  it('só mapeia tecnologias que existem em skills.ts', () => {
    const names = skills.flatMap((g) => g.items)
    for (const name of Object.keys(skillIcons)) expect(names).toContain(name)
  })
})
