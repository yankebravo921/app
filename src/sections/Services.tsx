import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const services = [
  { name: 'DESIGN', angle: 180 },
  { name: 'DEVELOPMENT', angle: 270 },
  { name: 'SEO', angle: 0 },
  { name: 'CONVERSION', angle: 90 },
];

const CircularDashedLine = ({ style }: { style?: any }) => {
  return (
    <motion.svg
      style={style}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 600"
      fill="none"
    >
      <motion.circle
        cx="300"
        cy="300"
        r="280"
        stroke="#a3e635"
        strokeWidth="2"
        strokeDasharray="20 15"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Tick marks */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 300 + 265 * Math.cos(angle);
        const y1 = 300 + 265 * Math.sin(angle);
        const x2 = 300 + 280 * Math.cos(angle);
        const y2 = 300 + 280 * Math.sin(angle);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#a3e635"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.02 }}
          />
        );
      })}
    </motion.svg>
  );
};

const ServiceLabel = ({ name, angle, index }: { name: string; angle: number; index: number }) => {
  const radiusPercent = 51; // Brought closer (was 53) to help fit in viewport, still outside ring
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
      {/* Dot - Centered exactly on the anchoring point */}
      <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-lime rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Label - Positioned relative to the dot */}
      <span className={`absolute font-display text-sm sm:text-base md:text-lg lg:text-xl text-black tracking-wide whitespace-nowrap ${textClasses}`}>
        {name}
      </span>
    </motion.div>
  );
};

const HoneycombDecoration = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute ${className} w-20 h-24 md:w-32 md:h-36`}
    viewBox="0 0 150 170"
    fill="none"
  >
    {[...Array(9)].map((_, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = col * 50 + (row % 2) * 25;
      const y = row * 45;
      const isFilled = [1, 3, 5, 7].includes(i);
      return (
        <path
          key={i}
          d={`M${x + 25} ${y} L${x + 50} ${y + 15} L${x + 50} ${y + 40} L${x + 25} ${y + 55} L${x} ${y + 40} L${x} ${y + 15} Z`}
          fill={isFilled ? "#a3e635" : "none"}
          stroke="#a3e635"
          strokeWidth="1"
          fillOpacity={isFilled ? 0.25 : 0}
        />
      );
    })}
  </svg>
);

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    // Increased padding-bottom to avoid clipping the bottom label
    <section ref={ref} className="relative min-h-screen bg-[#f5f5f5] overflow-hidden pt-8 md:pt-12 pb-48 md:pb-64">
      {/* Honeycomb decorations */}
      <HoneycombDecoration className="left-2 md:left-4 top-10 md:top-20 opacity-50 hidden sm:block" />
      <HoneycombDecoration className="right-4 md:right-8 bottom-10 md:bottom-20 opacity-40 scale-75 hidden md:block" />
      <HoneycombDecoration className="left-8 md:left-16 bottom-20 md:bottom-32 opacity-30 scale-50 hidden lg:block" />

      {/* Centered circular services layout */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        {/* Main Responsive Square Container */}
        <div className="relative w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px]">

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

          {/* Horizontal guide lines - hidden on mobile, centered in wrapper */}
          <motion.div
            className="absolute top-1/2 left-[-100vw] right-[-100vw] h-px bg-gray-300 hidden md:block" // Wide lines
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          />
          <motion.div
            className="absolute left-1/2 top-[-100vh] bottom-[-100vh] w-px bg-gray-300 hidden md:block" // Tall lines
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
        </div>
      </div>
    </section>
  );
}
