import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from 'react'
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

function CloseIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Carrossel simples: uma imagem por vez, setas, indicadores e as setas do
 * teclado. Não troca sozinho (o projeto só permite o fade-in como animação).
 * Clicar na imagem abre um visualizador ampliado num <dialog> nativo.
 */
export function ImageCarousel({ images, label }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const zoomRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reopenFocus = useRef(false)
  const total = images.length
  const current = images[index]
  const go = (next: number) => setIndex((next + total) % total)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (zoomed) {
      // jsdom e navegadores antigos não têm showModal: usa o atributo open.
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
      closeRef.current?.focus()
    } else {
      if (typeof dialog.close === 'function') {
        if (dialog.open) dialog.close()
      } else {
        dialog.removeAttribute('open')
      }
      if (reopenFocus.current) {
        reopenFocus.current = false
        zoomRefs.current[index]?.focus()
      }
    }
  }, [zoomed, index])

  function closeZoom() {
    reopenFocus.current = true
    setZoomed(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    } else if (event.key === 'Escape' && zoomed) {
      event.preventDefault()
      closeZoom()
    }
  }

  // Esc no <dialog> nativo dispara "cancel": fecha pelo estado do React.
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault()
    closeZoom()
  }

  // Clique no fundo escurecido (fora da imagem) fecha.
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeZoom()
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
            <button
              ref={(element) => {
                zoomRefs.current[i] = element
              }}
              type="button"
              className={styles.zoom}
              aria-label={`Ampliar imagem ${i + 1} de ${total}`}
              onClick={() => setZoomed(true)}
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
            </button>
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
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label="Imagem ampliada"
        onCancel={handleCancel}
        onClick={handleBackdropClick}
      >
        {zoomed && (
          <div className={styles.lightboxInner}>
            <img
              key={current.src}
              className={styles.lightboxImage}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
            />
            <button
              ref={closeRef}
              type="button"
              className={`${styles.arrow} ${styles.close}`}
              aria-label="Fechar"
              onClick={closeZoom}
            >
              <CloseIcon />
            </button>
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
            <p className={styles.lightboxCounter}>
              {index + 1} de {total}
            </p>
          </div>
        )}
      </dialog>
    </div>
  )
}
