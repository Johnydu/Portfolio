import type { FocusArea } from '../types'

/**
 * Serviços mostrados em "O que faço", na seção Sobre, pensados para quem
 * procura um desenvolvedor freelance. As tecnologias precisam existir em
 * skills.ts ou em projects.ts, e os exemplos apontam só para projetos reais
 * (verificado em teste).
 */
export const focusAreas: readonly FocusArea[] = [
  {
    title: 'Landing pages',
    description:
      'Página única para divulgar um negócio, serviço ou evento: rápida, responsiva e com chamada direta para o WhatsApp.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    example: {
      label: 'landing page Bushido Karatê',
      href: 'https://johnydu.github.io/landing-page/',
    },
  },
  {
    title: 'Sites institucionais',
    description:
      'Sites para empresas e profissionais apresentarem o que fazem, com boa leitura no celular, acessibilidade e o básico de SEO para o Google.',
    technologies: ['React', 'TypeScript', 'HTML5', 'CSS3'],
    example: {
      label: 'código deste portfólio',
      href: 'https://github.com/Johnydu/Portfolio',
    },
  },
  {
    title: 'Sistemas web',
    description:
      'Sistemas sob medida acessados pelo navegador, com cadastros, níveis de acesso por usuário, acompanhamento de processos e histórico.',
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'PostgreSQL'],
    example: {
      label: 'LumiFlow, gestão da produção industrial',
      href: 'https://github.com/Johnydu/LumiFlow',
    },
  },
  {
    title: 'Sistemas desktop',
    description:
      'Aplicações em Java para rodar no computador da empresa, ideais para controles internos do dia a dia.',
    technologies: ['Java'],
  },
]
