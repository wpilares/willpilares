import { Footer, Header } from '@components'
import { Contact, Experience, Hero } from '@content'

export const App = () => {
  return (
    <div className="min-h-screen bg-light-bg-primary transition-colors duration-300 dark:bg-dark-bg-primary">
      <Header />
      <main>
        <Hero />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
