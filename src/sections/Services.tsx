import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import HoneycombDecoration from '../components/HoneycombDecoration';

const services = [
  { name: 'DESIGN', angle: 180 },
  { name: 'DEVELOPMENT', angle: 270 },
  { name: 'SEO', angle: 0 },
  { name: 'CONVERSION', angle: 90 },
];

/* ─── styles injected once via <style> tag ────────────────────────────── */
const ringStyles = `
  @keyframes scanner-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .services-ring-wrapper {
    --scanner-duration: 14s;
  }

  .services-ring-wrapper:hover .scanner-arc,
  .services-ring-wrapper.active .scanner-arc {
    filter: drop-shadow(0 0 6px rgba(163,230,53,0.35));
    animation-duration: 12s !important;
  }

  .services-ring-wrapper:hover .ring-outer,
  .services-ring-wrapper.active .ring-outer {
    filter: drop-shadow(0 0 4px rgba(163,230,53,0.2));
  }

  .scanner-arc {
    animation: scanner-rotate var(--scanner-duration) linear infinite;
    transform-origin: 300px 300px;
  }

  @media (prefers-reduced-motion: reduce) {
    .scanner-arc {
      animation: none !important;
    }
    .services-ring-wrapper:hover .scanner-arc {
      animation: none !important;
    }
  }

  /* Crosshair gradient lines */
  .crosshair-h {
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(163,230,53,0.04) 20%,
      rgba(163,230,53,0.12) 45%,
      rgba(163,230,53,0.12) 55%,
      rgba(163,230,53,0.04) 80%,
      transparent 100%
    );
  }

  .crosshair-v {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(163,230,53,0.04) 20%,
      rgba(163,230,53,0.12) 45%,
      rgba(163,230,53,0.12) 55%,
      rgba(163,230,53,0.04) 80%,
      transparent 100%
    );
  }
`;

/* ─── Circular ring with dual-stroke, scanner, and upgraded ticks ───── */
const CircularDashedLine = ({ style }: { style?: any }) => {
  const R = 280;        // ring radius
  const CX = 300;       // center X
  const CY = 300;       // center Y
  const TICKS = 24;     // total tick marks

  /* Build tick data: major at 0°/90°/180°/270° (indices 0,6,12,18) */
  const ticks = [...Array(TICKS)].map((_, i) => {
    const angleDeg = i * (360 / TICKS);
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const innerR = isMajor ? R - 30 : R - 18;
    const outerR = R + 2;
    const strokeW = isMajor ? 4.5 : 2.5;
    const opacity = isMajor ? 1 : 0.85;

    return {
      x1: CX + innerR * Math.cos(angleRad),
      y1: CY + innerR * Math.sin(angleRad),
      x2: CX + outerR * Math.cos(angleRad),
      y2: CY + outerR * Math.sin(angleRad),
      strokeW,
      opacity,
      isMajor,
      id: `tick-grad-${i}`,
      angleDeg,
      angleRad,
    };
  });

  /* Scanner arc path (≈45° arc on the ring) */
  const scannerStartAngle = 0;
  const scannerEndAngle = 50;
  const startRad = (scannerStartAngle * Math.PI) / 180;
  const endRad = (scannerEndAngle * Math.PI) / 180;
  const scannerPath = [
    `M ${CX + R * Math.cos(startRad)} ${CY + R * Math.sin(startRad)}`,
    `A ${R} ${R} 0 0 1 ${CX + R * Math.cos(endRad)} ${CY + R * Math.sin(endRad)}`,
  ].join(' ');

  return (
    <>
      <style>{ringStyles}</style>
      <motion.svg
        style={style}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 600 600"
        fill="none"
      >
        <defs>
          {/* Gradient for the outer ring stroke */}
          <linearGradient id="ring-outer-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#a3e635" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.45" />
          </linearGradient>

          {/* Gradient for the inner ring stroke */}
          <linearGradient id="ring-inner-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#a3e635" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.7" />
          </linearGradient>

          {/* Scanner arc gradient */}
          <linearGradient id="scanner-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0" />
            <stop offset="20%" stopColor="#a3e635" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#a3e635" stopOpacity="1" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
          </linearGradient>

          {/* Tick fade gradients — from lime to transparent outward */}
          {ticks.map((t) => (
            <linearGradient
              key={t.id}
              id={t.id}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#a3e635" stopOpacity={t.opacity * 0.5} />
              <stop offset="100%" stopColor="#a3e635" stopOpacity={t.opacity} />
            </linearGradient>
          ))}
        </defs>

        {/* ── 1) Outer ring: thin, low opacity ──────────────────────── */}
        <motion.circle
          className="ring-outer"
          cx={CX}
          cy={CY}
          r={R}
          stroke="url(#ring-outer-grad)"
          strokeWidth="2"
          strokeDasharray="20 12"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* ── 2) Inner ring: brighter, slightly inset ───────────────── */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={R - 4}
          stroke="url(#ring-inner-grad)"
          strokeWidth="2.5"
          strokeDasharray="6 16"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.15 }}
        />

        {/* ── 3) Scanner highlight arc ──────────────────────────────── */}
        <path
          className="scanner-arc"
          d={scannerPath}
          stroke="url(#scanner-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── 4) Tick marks — major / minor ─────────────────────────── */}
        {ticks.map((t, i) => (
          <motion.line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={`url(#${t.id})`}
            strokeWidth={t.strokeW}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.02 }}
          />
        ))}

        {/* ── 5) Small diamond markers at major tick positions ──────── */}
        {ticks.filter(t => t.isMajor).map((t, i) => {
          const mx = CX + (R + 6) * Math.cos(t.angleRad);
          const my = CY + (R + 6) * Math.sin(t.angleRad);
          return (
            <motion.polygon
              key={`diamond-${i}`}
              points={`${mx},${my - 3} ${mx + 2},${my} ${mx},${my + 3} ${mx - 2},${my}`}
              fill="#a3e635"
              fillOpacity="0.6"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 + i * 0.1 }}
            />
          );
        })}
      </motion.svg>
    </>
  );
};

const ServiceLabel = ({ name, angle, index }: { name: string; angle: number; index: number }) => {
  const radiusPercent = 48; // Brought closer (was 53) to help fit in viewport, still outside ring
  const radian = (angle * Math.PI) / 180;

  // Calculate position on the circle (center of the dot)
  const xPercent = 50 + (Math.cos(radian) * radiusPercent);
  const yPercent = 50 + (Math.sin(radian) * radiusPercent);

  // Text alignment classes based on angle
  let textClasses = "";
  if (angle === 180) { // Left (DESIGN)
    textClasses = "right-full mr-4 top-1/2 -translate-y-1/2";
  } else if (angle === 0) { // Right (SEO)
    textClasses = "left-full ml-4 top-1/2 -translate-y-1/2";
  } else if (angle === 270) { // Top (DEVELOPMENT)
    textClasses = "bottom-full mb-4 left-1/2 -translate-x-1/2";
  } else if (angle === 90) { // Bottom (CONVERSION)
    textClasses = "top-full mt-4 left-1/2 -translate-x-1/2";
  }

  return (
    <motion.div
      className="absolute w-0 h-0 flex items-center justify-center"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
    >
      {/* Label with animated underline */}
      <span className={`absolute font-display text-sm sm:text-base md:text-lg lg:text-xl text-black tracking-wide whitespace-nowrap ${textClasses}`}>
        <span className="relative inline-block">
          {name}
          {/* Animated underline */}
          <motion.span
            className="absolute left-0 bottom-[-4px] h-[2px] w-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #a3e635 0%, rgba(163,230,53,0.3) 100%)',
              transformOrigin: 'left center',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 1.2 + index * 0.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </span>
      </span>
    </motion.div>
  );
};


export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    // Increased padding-bottom to avoid clipping the bottom label
    <section ref={ref} className="relative min-h-screen bg-[#f5f5f5] overflow-hidden pt-8 md:pt-12 pb-48 md:pb-64">
      {/* Honeycomb decorations */}
      {/* Honeycomb decorations */}
      <HoneycombDecoration className="left-2 md:left-4 top-6 md:top-14 w-48 h-56 md:w-64 md:h-72 opacity-60 hidden sm:block" />
      <HoneycombDecoration className="right-4 md:right-8 bottom-8 md:bottom-16 w-44 h-52 md:w-56 md:h-64 opacity-45 hidden md:block" />
      <HoneycombDecoration className="left-8 md:left-16 bottom-16 md:bottom-28 w-36 h-44 md:w-48 md:h-56 opacity-30 hidden lg:block" />

      {/* Centered circular services layout */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        {/* Main Responsive Square Container */}
        <div
          className={`services-ring-wrapper relative w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] pointer-events-auto ${isHovered ? 'active' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Horizontal crosshair - gradient fade */}
          <motion.div
            className="crosshair-h absolute top-1/2 left-[-100vw] right-[-100vw] h-px hidden md:block"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          />
          {/* Vertical crosshair - gradient fade */}
          <motion.div
            className="crosshair-v absolute left-1/2 top-[-100vh] bottom-[-100vh] w-px hidden md:block"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
          />

          {/* Dashed circle */}
          <CircularDashedLine style={{ rotate: rotation }} />

          {/* Service labels positioned around the circle */}
          <div className="absolute inset-0">
            {services.map((service, index) => (
              <ServiceLabel
                key={service.name}
                name={service.name}
                angle={service.angle}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
