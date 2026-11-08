import { useState, type KeyboardEvent } from 'react'
import type { ProjectImage } from '../../types'
import styles from './ImageCarousel.module.css'

interface ImageCarouselProps {
  images: readonly ProjectImage[]
  /** Nome do carrossel para leitores de tela, ex.: "Imagens do LumiFlow". */
  label: string
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Carrossel simples: uma imagem por vez, setas, indicadores e as setas do
 * teclado. Não troca sozinho (o projeto só permite o fade-in como animação).
 */
export function ImageCarousel({ images, label }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const total = images.length
  const go = (next: number) => setIndex((next + total) % total)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    }
  }

  return (
    <div
      className={styles.carousel}
      role="group"
      aria-roledescription="carrossel"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.viewport}>
        {images.map((image, i) => (
          <div
            key={image.src}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            hidden={i !== index}
          >
            <img
              className={styles.image}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          aria-label="Imagem anterior"
          onClick={() => go(index - 1)}
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          aria-label="Próxima imagem"
          onClick={() => go(index + 1)}
        >
          <Chevron direction="right" />
        </button>
      </div>
      <div className={styles.footer}>
        <p className={styles.counter} aria-live="polite">
          {index + 1} de {total}
        </p>
        <div className={styles.dots} role="group" aria-label="Escolher imagem">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              className={styles.dot}
              aria-label={`Mostrar imagem ${i + 1} de ${total}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
