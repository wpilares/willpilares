import { Footer, Header } from '@components'
import { AboutMe, Contact, Experience, Hero, Projects, Skills } from '@content'
import { Mascot } from '@mascot/react'

export const App = () => {
  return (
    <div className="min-h-screen bg-night">
      <div aria-hidden className="paper-grain" />
      <div aria-hidden className="vignette" />
      <div className="relative z-10">
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
      <Mascot />
    </div>
  )
}
