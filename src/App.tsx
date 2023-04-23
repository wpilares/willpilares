import { type ReactElement } from 'react';
import Header from './components/header/Header.tsx';
import Hero from './content/hero/Hero.tsx';
import Experience from './content/experience/Experience.tsx';
import Contact from './content/contact/Contact.tsx';
import Footer from './components/footer/Footer.tsx';

function App(): ReactElement {
  return (
    <>
      <Header />
      <Hero />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
