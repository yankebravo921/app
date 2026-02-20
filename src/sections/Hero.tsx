import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import HoneycombDecoration from '../components/HoneycombDecoration';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#f5f5f5] overflow-hidden flex items-center">
      {/* Honeycomb decorations - hidden on small mobile */}
      <HoneycombDecoration className="left-2 md:left-8 bottom-16 md:bottom-28 w-48 h-56 md:w-64 md:h-72 opacity-60 hidden sm:block" />
      <HoneycombDecoration className="right-4 md:right-16 top-12 md:top-20 w-44 h-52 md:w-56 md:h-64 opacity-40 hidden md:block" />

      {/* Vertical scroll indicator line - hidden on mobile */}
      <motion.div
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-1 h-24 md:h-32 bg-gray-300 rounded-full overflow-hidden hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-full bg-lime"
          style={{ height: `${Math.min((scrollY / 500) * 100, 100)}%` }}
        />
      </motion.div>



      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left content */}
          <motion.div
            className="lg:col-span-5 space-y-6 md:space-y-8 order-2 lg:order-1 mt-12 lg:mt-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-base md:text-lg lg:text-xl text-gray-800 max-w-md leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              We design immersive, motion-driven websites that command attention and guide users to act. Clean builds. Sharp strategy. Zero fluff.
            </p>

            <div className="flex justify-center lg:justify-start">
              <motion.button
                className="bg-lime text-black font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-lime-dark transition-colors duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LET'S TALK
              </motion.button>
            </div>
          </motion.div>

          {/* Mobile/Tablet Spacer for Logo */}
          <div className="h-48 sm:h-56 md:h-72 w-full lg:hidden" aria-hidden="true" />

          {/* Right content - Large typography */}
          <motion.div
            className="relative order-1 lg:order-2 lg:col-span-5 lg:col-start-8 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative z-10 flex flex-col items-center lg:items-end text-center lg:text-right">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight">
                <motion.span
                  className="block text-black hover:bg-gradient-to-r hover:from-[#bef264] hover:via-[#a3e635] hover:to-[#65a30d] hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  YOUR BRAND
                </motion.span>
                <motion.span
                  className="block text-lime hover:bg-gradient-to-r hover:from-[#bef264] hover:via-[#a3e635] hover:to-[#65a30d] hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  DESERVES MORE
                </motion.span>
                <motion.span
                  className="block text-black hover:bg-gradient-to-r hover:from-[#bef264] hover:via-[#a3e635] hover:to-[#65a30d] hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  THAN A PRETTY
                </motion.span>
                <motion.span
                  className="block text-black hover:bg-gradient-to-r hover:from-[#bef264] hover:via-[#a3e635] hover:to-[#65a30d] hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  WEBSITE.
                </motion.span>
              </h1>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
