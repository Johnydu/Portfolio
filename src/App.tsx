import { Footer, Header } from './components/layout'
import { About } from './sections/About/About'
import { Contact } from './sections/Contact/Contact'
import { Hero } from './sections/Hero/Hero'
import { Projects } from './sections/Projects/Projects'
import { Skills } from './sections/Skills/Skills'
import { Timeline } from './sections/Timeline/Timeline'

function App() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
