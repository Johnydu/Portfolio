import { Section } from '../../components/layout'
import { Button, SectionTitle } from '../../components/ui'
import { profile } from '../../data/profile'
import styles from './Contact.module.css'

interface ContactProps {
  resumeUrl?: string
}

export function Contact({ resumeUrl = profile.resumeUrl }: ContactProps) {
  return (
    <Section id="contato" titleId="titulo-contato">
      <SectionTitle label="05 / contato" title="Contato" id="titulo-contato" />
      <div className={styles.layout}>
        <figure className={styles.photoFrame}>
          <img
            className={styles.photo}
            src={profile.contactPhoto.src}
            alt={profile.contactPhoto.alt}
            width={profile.contactPhoto.width}
            height={profile.contactPhoto.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className={styles.content}>
          <p className={styles.text}>
            Estou aberto a vagas de desenvolvedor Backend Java e a projetos
            freelance. O melhor canal para falar comigo é o LinkedIn.
          </p>
          <div className={styles.actions}>
            <Button href={profile.links.linkedin} external variant="primary">
              LinkedIn
            </Button>
            <Button href={profile.links.github} external variant="secondary">
              GitHub
            </Button>
            <Button href={profile.links.instagram} external variant="secondary">
              Instagram
            </Button>
            {resumeUrl && (
              <Button href={resumeUrl} external variant="secondary">
                Currículo em PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
