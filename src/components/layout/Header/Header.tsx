import styles from './Header.module.css'
import { useActiveSection } from './useActiveSection'

const navItems = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'tecnologias', label: 'Tecnologias' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'trajetoria', label: 'Trajetória' },
  { id: 'contato', label: 'Contato' },
] as const

const sectionIds = navItems.map((item) => item.id)

export function Header() {
  const active = useActiveSection(sectionIds)

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className={styles.inner}>
        <a className={styles.brand} href="#inicio">
          Johny Duarte
        </a>
        <nav aria-label="Principal">
          <ul className={styles.list}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className={styles.link}
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
