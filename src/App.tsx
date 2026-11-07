import { Footer, Header, ProfileCard } from './components/layout'
import { About } from './sections/About/About'
import { Contact } from './sections/Contact/Contact'
import { Hero } from './sections/Hero/Hero'
import { Projects } from './sections/Projects/Projects'
import { Skills } from './sections/Skills/Skills'
import { Timeline } from './sections/Timeline/Timeline'
import styles from './App.module.css'

function App() {
  return (
    <>
      <Header />
      <div className={styles.layout}>
        <ProfileCard />
        <main id="conteudo" className={styles.main}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Timeline />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
