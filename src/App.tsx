import { Footer, Header } from '@components'
import { AboutMe, Contact, Experience, Hero, Projects, Skills } from '@content'

export const App = () => {
  return (
    <div className="min-h-screen bg-light-bg-primary transition-colors duration-300 dark:bg-dark-bg-primary">
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
