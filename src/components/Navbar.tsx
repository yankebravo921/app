import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'HOME', href: '#home' },
  { name: 'SERVICES', href: '#services' },
  { name: 'PROCESS', href: '#process' },
  { name: 'WORK', href: '#work' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed bottom navbar */}
      <motion.nav
        className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="bg-black rounded-full px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between shadow-2xl">
          {/* Menu button */}
          <motion.button
            className="flex items-center gap-2 text-white hover:text-lime transition-colors"
            onClick={() => setIsMenuOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-lime rounded-lg flex items-center justify-center">
              <Menu className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
            <span className="font-medium text-sm md:text-base hidden sm:block">Menu</span>
          </motion.button>

          {/* Logo */}
          <div className="flex items-center">
            <span className="font-display text-lg md:text-xl text-white tracking-wide">Anyflow</span>
          </div>

          {/* Contact button */}
          <motion.button
            className="bg-lime text-black font-semibold px-3 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-lime-dark transition-colors text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#contact')}
          >
            <span className="hidden sm:inline">Contact Us</span>
            <span className="sm:hidden">Contact</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Menu popup overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.div
              className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Navigation buttons */}
              <nav className="flex flex-col gap-2 md:gap-3">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="bg-lime text-black font-display text-base md:text-lg px-8 md:px-12 py-2.5 md:py-3 rounded-lg hover:bg-lime-dark transition-colors min-w-[160px] md:min-w-[200px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </nav>

              {/* QR Code section */}
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white p-3 md:p-4 rounded-xl">
                  {/* QR Code SVG */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-20 h-20 md:w-28 md:h-28"
                  >
                    {/* QR Code pattern - simplified representation */}
                    <rect fill="white" width="100" height="100"/>
                    {/* Position detection patterns */}
                    <rect x="5" y="5" width="25" height="25" fill="black"/>
                    <rect x="8" y="8" width="19" height="19" fill="white"/>
                    <rect x="11" y="11" width="13" height="13" fill="black"/>
                    
                    <rect x="70" y="5" width="25" height="25" fill="black"/>
                    <rect x="73" y="8" width="19" height="19" fill="white"/>
                    <rect x="76" y="11" width="13" height="13" fill="black"/>
                    
                    <rect x="5" y="70" width="25" height="25" fill="black"/>
                    <rect x="8" y="73" width="19" height="19" fill="white"/>
                    <rect x="11" y="76" width="13" height="13" fill="black"/>
                    
                    {/* Data modules - random pattern */}
                    {[...Array(20)].map((_, i) => (
                      <rect 
                        key={i}
                        x={35 + (i % 5) * 6} 
                        y={10 + Math.floor(i / 5) * 6} 
                        width="4" 
                        height="4" 
                        fill="black"
                      />
                    ))}
                    {[...Array(15)].map((_, i) => (
                      <rect 
                        key={`b${i}`}
                        x={10 + (i % 5) * 6} 
                        y={40 + Math.floor(i / 5) * 6} 
                        width="4" 
                        height="4" 
                        fill="black"
                      />
                    ))}
                    {[...Array(12)].map((_, i) => (
                      <rect 
                        key={`c${i}`}
                        x={40 + (i % 4) * 6} 
                        y={45 + Math.floor(i / 4) * 6} 
                        width="4" 
                        height="4" 
                        fill="black"
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <rect 
                        key={`d${i}`}
                        x={70 + (i % 3) * 6} 
                        y={40 + Math.floor(i / 3) * 6} 
                        width="4" 
                        height="4" 
                        fill="black"
                      />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <rect 
                        key={`e${i}`}
                        x={35 + (i % 4) * 6} 
                        y={70 + Math.floor(i / 4) * 6} 
                        width="4" 
                        height="4" 
                        fill="black"
                      />
                    ))}
                    {[...Array(6)].map((_, i) => (
                      <rect 
                        key={`f${i}`}
                        x={70 + (i % 3) * 6} 
                        y={75 + Math.floor(i / 3) * 6} 
                        width="4" 
                        height="4" 
                        fill="black"
                      />
                    ))}
                  </svg>
                </div>
                <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-lime rounded-full"></span>
                  Control with phone
                </p>
              </motion.div>
            </motion.div>

            {/* Close button - positioned at bottom like in video */}
            <motion.button
              className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white z-20"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-lime rounded-lg flex items-center justify-center">
                <X className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </div>
              <span className="font-medium text-sm md:text-base">Close</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
