import { Footer, Header } from '@components'
import { AboutMe, Contact, Experience, Hero, Projects, Skills } from '@content'

export const App = () => {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <AboutMe />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
