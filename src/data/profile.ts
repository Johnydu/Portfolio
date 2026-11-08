import contactPhotoSrc from '../assets/johny-duarte-contato.webp'
import aboutPhotoSrc from '../assets/johny-duarte-lendo.webp'
import photoSrc from '../assets/johny-duarte.webp'
import type { Profile } from '../types'

export const profile: Profile = {
  name: 'Johny Duarte',
  headline: 'Desenvolvedor Backend Java | Spring Boot | PostgreSQL',
  location: 'São José do Rio Preto — SP',
  tagline:
    'Aberto a oportunidades como desenvolvedor Backend Java e a projetos freelance',
  photo: {
    src: photoSrc,
    alt: 'Foto de Johny Duarte, de óculos e blusa preta de gola alta, com os braços cruzados',
    width: 800,
    height: 800,
  },
  contactPhoto: {
    src: contactPhotoSrc,
    alt: 'Johny Duarte sorrindo, de óculos escuros e blazer claro, num terraço com a cidade ao entardecer ao fundo',
    width: 800,
    height: 1013,
  },
  aboutPhoto: {
    src: aboutPhotoSrc,
    alt: 'Johny Duarte lendo um livro com uma xícara de café, com o notebook aberto ao fundo',
    width: 800,
    height: 1071,
  },
  about: [
    'Sou estudante de Análise e Desenvolvimento de Sistemas e desenvolvedor com foco em Java e desenvolvimento backend. Tenho interesse em construir aplicações bem estruturadas, APIs REST e sistemas que resolvam problemas reais de negócio.',
    'Atualmente estudo e desenvolvo projetos com Java, Spring Boot, Spring Data JPA, Spring Security e PostgreSQL. Minha experiência prática em ambiente industrial contribui para o meu entendimento de processos operacionais e das necessidades de sistemas de gestão.',
  ],
  aiNote:
    'Utilizo o Claude Code como apoio ao desenvolvimento: análise de código existente, implementação e evolução de funcionalidades, investigação de erros, refatoração e documentação técnica. As sugestões são avaliadas e validadas segundo os requisitos, as regras de negócio e a qualidade do código; as decisões técnicas e a responsabilidade pela solução permanecem comigo.',
  links: {
    linkedin: 'https://www.linkedin.com/in/johny-duarte-3a2b6435b/',
    github: 'https://github.com/Johnydu',
    instagram: 'https://www.instagram.com/johnydu/',
  },
}
