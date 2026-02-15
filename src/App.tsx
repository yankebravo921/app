import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Process from './sections/Process';
import FeaturedWork from './sections/FeaturedWork';
import Footer from './sections/Footer';
import TextAnimation from './sections/TextAnimation';
import ThreeDLogo from './components/ThreeDLogo';
import ServicesIntro from './sections/ServicesIntro';

function App() {
  const containerRef = useRef(null);

  const logoScale = 1.3;

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">

      {/* 
        SCROLL LOGO CONTAINER 
        - Absolute positioned over the top 200vh (Hero + Services)
        - Uses 'sticky' to keep the logo screen-centered while valid
        - Scrolls away naturally when the 200vh ends (entering Process)
      */}
      <div
        className="absolute top-0 left-0 right-0 h-[230vh] z-40 pointer-events-none"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96"
            style={{ scale: logoScale }}
          >
            <ThreeDLogo />
          </motion.div>
        </div>
      </div>

      {/* Main content sections */}
      <main className="relative z-0">
        <section id="home">
          <Hero />
        </section>

        <ServicesIntro />

        <section id="services">
          <Services />
        </section>

        <section id="process">
          <Process />
        </section>

        <section id="work">
          <FeaturedWork />
        </section>

        <TextAnimation />

        <section id="contact">
          <Footer />
        </section>
      </main>

      <Navbar />
    </div>
  );
}

export default App;
