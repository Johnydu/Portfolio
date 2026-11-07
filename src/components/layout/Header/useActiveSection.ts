import { useEffect, useState } from 'react'

export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [ids])

  return active
}
