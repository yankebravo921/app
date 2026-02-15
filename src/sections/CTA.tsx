import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-lime overflow-hidden py-16 md:py-20">
      {/* Bottom edge decoration - transitioning to black */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-10 md:h-16"
          viewBox="0 0 1200 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L0 48 Q150 64 300 48 Q450 32 600 48 Q750 64 900 48 Q1050 32 1200 48 L1200 0 Z"
            fill="black"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-end">
          {/* Left - Large title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black leading-tight">
              EVERY WORK YOU
              <br />
              SEE HERE STARTED
              <br />
              WITH CURIOSITY
            </h2>
          </motion.div>

          {/* Right - Description and button */}
          <motion.div
            className="lg:pb-4 md:pb-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-black/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6 max-w-md">
              Have an idea, a challenge, or a direction you want to explore? You don't need all the answers yet. A focused conversation is often enough to uncover the right path. Reach out and let's see what we can build together.
            </p>
            <motion.button
              className="bg-black text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              MAKE IT REAL
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
