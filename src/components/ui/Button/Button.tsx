import type { ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary'

interface BaseProps {
  variant?: Variant
  children: ReactNode
}

interface LinkProps extends BaseProps {
  href: string
  external?: boolean
}

interface ActionProps extends BaseProps {
  href?: undefined
  external?: undefined
}

export type ButtonProps = LinkProps | ActionProps

export function Button(props: ButtonProps) {
  const { variant = 'primary', children } = props
  const className = `${styles.button} ${styles[variant]}`

  if (props.href === undefined) {
    return (
      <button type="button" className={className}>
        {children}
      </button>
    )
  }

  if (props.external) {
    return (
      <a
        className={className}
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <span className={styles.srOnly}> (abre em nova aba)</span>
      </a>
    )
  }

  return (
    <a className={className} href={props.href}>
      {children}
    </a>
  )
}
