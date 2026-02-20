import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useMemo, useState, useCallback } from 'react';

// ============================================================
// SLOGANS — Edit these to change the displayed text
// ============================================================
const SLOGANS = [
  'DESIGN WITH PURPOSE.',
  'DESIGN WITH INTENTION.',
  'CRAFTED TO CONVERT.',
  'BUILT TO MEAN SOMETHING.',
];

// ============================================================
// CONFIGURATION
// ============================================================
const BLUR_AMOUNT = 8;         // Max blur in px when letter is hidden
const LETTER_Y_SHIFT = 14;     // Y offset in px when letter is hidden

// ============================================================
// LetterReveal — Renders text with per-letter fade animation
// ============================================================
function LetterReveal({ text, visibility }: { text: string; visibility: number }) {
  // visibility: 0 = fully hidden, 1 = fully visible
  const letters = useMemo(() => text.split(''), [text]);
  const count = letters.length;

  return (
    <span className="inline-flex flex-wrap justify-center">
      {letters.map((char, i) => {
        // Each letter has its own "window" within the 0–1 visibility range
        // Letters reveal sequentially: first letter starts at 0, last finishes at 1
        const start = (i / count) * 0.7;       // when this letter starts appearing
        const end = start + 0.3;                 // when it's fully visible
        const t = Math.max(0, Math.min(1, (visibility - start) / (end - start)));

        return (
          <span
            key={`${char}-${i}`}
            className="inline-block"
            style={{
              opacity: t,
              filter: `blur(${(1 - t) * BLUR_AMOUNT}px)`,
              transform: `translateY(${(1 - t) * LETTER_Y_SHIFT}px)`,
              transition: 'none',
              willChange: 'opacity, filter, transform',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
}

// ============================================================
// ScrollSlogans — Scroll-driven slogan transitions
// ============================================================
function ScrollSlogans() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numSlogans = SLOGANS.length;

  // Total height = enough scroll for each slogan to have its moment
  // Each slogan gets 180vh of scroll space for slower, smoother transitions
  const totalHeightVh = numSlogans * 180;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // State: which slogan to show + how visible it is (0 to 1)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letterVisibility, setLetterVisibility] = useState(1);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Map total progress to a float "slogan position"
    // e.g., 0.0 = start of slogan 0, 1.0 = start of slogan 1, etc.
    const sloganFloat = progress * numSlogans;
    const idx = Math.floor(sloganFloat);
    const frac = sloganFloat - idx; // 0–1 within current slogan's scroll segment

    // Clamp index
    const safeIdx = Math.min(idx, numSlogans - 1);

    // Within each segment (wider windows = smoother transitions):
    //   0.00–0.35: slogan is fully visible (long hold)
    //   0.35–0.50: slogan fades OUT slowly (letters disappear)
    //   0.50–0.70: next slogan fades IN slowly (letters appear)
    //   0.70–1.00: next slogan fully visible (long hold)

    // Smooth easing function for fade transitions
    const easeInOut = (t: number) => t * t * (3 - 2 * t);

    if (safeIdx >= numSlogans - 1) {
      // Last slogan — just show it
      setCurrentIndex(numSlogans - 1);
      setLetterVisibility(1);
    } else if (frac <= 0.35) {
      // Hold current slogan fully visible
      setCurrentIndex(safeIdx);
      setLetterVisibility(1);
    } else if (frac <= 0.50) {
      // Fade OUT current slogan (smoothed)
      const raw = (frac - 0.35) / 0.15;
      setCurrentIndex(safeIdx);
      setLetterVisibility(1 - easeInOut(raw));
    } else if (frac <= 0.70) {
      // Fade IN next slogan (smoothed)
      const raw = (frac - 0.50) / 0.20;
      setCurrentIndex(safeIdx + 1);
      setLetterVisibility(easeInOut(raw));
    } else {
      // Hold next slogan fully visible
      setCurrentIndex(safeIdx + 1);
      setLetterVisibility(1);
    }
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${totalHeightVh}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[700px] h-[300px] md:w-[1000px] md:h-[400px] rounded-full opacity-60"
            style={{
              background: 'radial-gradient(ellipse, rgba(163, 230, 53, 0.05) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Slogan text */}
        <div className="relative w-full px-4 sm:px-8 flex items-center justify-center min-h-[100px] md:min-h-[140px]">
          <h2 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white text-center leading-tight">
            <LetterReveal
              text={SLOGANS[currentIndex]}
              visibility={letterVisibility}
            />
          </h2>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {SLOGANS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex
                ? 'bg-lime w-8'
                : 'bg-white/20 w-1.5'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Corner cross decoration
// ============================================================
const CornerCross = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const positionClasses = {
    tl: 'top-4 left-4 md:top-8 md:left-8',
    tr: 'top-4 right-4 md:top-8 md:right-8',
    bl: 'bottom-4 left-4 md:bottom-8 md:left-8',
    br: 'bottom-4 right-4 md:bottom-8 md:right-8',
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} w-4 h-4 md:w-6 md:h-6`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 0 V24 M0 12 H24" stroke="white" strokeWidth="2" />
      </svg>
    </motion.div>
  );
};

// ============================================================
// Vortex tunnel effect
// ============================================================
const VortexSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0, 3]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="h-[150vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ scale, opacity }}
        >
          <svg
            className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px]"
            viewBox="0 0 700 700"
          >
            <defs>
              <radialGradient id="vortexGrad1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="30%" stopColor="#a3e635" />
                <stop offset="60%" stopColor="#65a30d" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </radialGradient>
              <filter id="glow1">
                <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[...Array(12)].map((_, i) => {
              const rotation = i * 30;
              return (
                <motion.g key={i} transform={`rotate(${rotation} 350 350)`}>
                  <motion.path
                    d="M350 350 Q400 300 450 350 Q500 400 450 450 Q400 500 350 450 Q300 400 350 350"
                    fill="none"
                    stroke="url(#vortexGrad1)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.8 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: i * 0.1 }}
                  />
                </motion.g>
              );
            })}

            <circle cx="350" cy="350" r="100" fill="url(#vortexGrad1)" filter="url(#glow1)" opacity="0.8" />
          </svg>

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border-2 border-lime/40"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
              }}
              animate={{ rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          <motion.div
            className="absolute w-32 h-32 md:w-48 md:h-48 bg-lime rounded-full"
            style={{
              filter: 'blur(40px)',
              boxShadow: '0 0 100px 50px rgba(163, 230, 53, 0.8)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================
// Main Export
// ============================================================
export default function TextAnimation() {
  return (
    <section className="relative bg-black">
      <CornerCross position="tl" />
      <CornerCross position="tr" />
      <CornerCross position="bl" />
      <CornerCross position="br" />

      <ScrollSlogans />
    </section>
  );
}
