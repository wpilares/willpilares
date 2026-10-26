import { Footer, Header } from '@components'
import { AboutMe, Contact, Experience, Projects, Skills } from '@content'
import { ChapterRail, City, MoonProgress, Prologue } from '@journal'
import { Mascot } from '@mascot/react'
import { SceneProvider } from '@scenes'

export const App = () => {
  return (
    <SceneProvider>
      <div className="min-h-screen bg-night">
        <div aria-hidden className="paper-grain" />
        <div aria-hidden className="vignette" />
        <div className="relative z-10">
          <Header />
          <main>
            <Prologue />
            <City />
            <AboutMe />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
        <ChapterRail />
        <MoonProgress />
        <Mascot />
      </div>
    </SceneProvider>
  )
}
