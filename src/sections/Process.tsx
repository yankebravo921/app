import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const processSteps = [
  {
    title: 'DISCOVERY',
    items: ['Creative Brief', 'Brand Research', 'Mood Boards'],
    variant: 'lime' as const,
  },
  {
    title: 'CONCEPT',
    items: ['Visual Direction', 'Art Direction', 'Storyboarding'],
    variant: 'dark' as const,
  },
  {
    title: 'DESIGN',
    items: ['UI/UX Craft', 'Motion Design', 'Interaction Design'],
    variant: 'lime' as const,
  },
  {
    title: 'DEVELOP',
    items: ['Creative Coding', 'WebGL & 3D', 'Animations'],
    variant: 'dark' as const,
  },
  {
    title: 'POLISH',
    items: ['Micro-interactions', 'Performance', 'Pixel Perfect'],
    variant: 'lime' as const,
  },
  {
    title: 'LAUNCH',
    items: ['Go Live', 'Case Study', 'Awards Submit'],
    variant: 'dark' as const,
  },
];

const ProcessCard = ({
  title,
  items,
  variant,
  index,
}: {
  title: string;
  items: string[];
  variant: 'lime' | 'dark';
  index: number;
}) => {
  const isLime = variant === 'lime';

  return (
    <motion.div
      className={`relative p-4 md:p-6 rounded-xl min-w-[140px] sm:min-w-[160px] md:min-w-[180px] ${
        isLime ? 'bg-lime' : 'bg-gray-900'
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <h3
        className={`font-display text-sm md:text-lg mb-2 md:mb-4 ${
          isLime ? 'text-black' : 'text-white'
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-1 md:space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className={`text-xs md:text-sm flex items-start gap-1.5 md:gap-2 ${
              isLime ? 'text-black/80' : 'text-white/80'
            }`}
          >
            <span className={`w-1 h-1 rounded-full mt-1 md:mt-1.5 flex-shrink-0 ${isLime ? 'bg-black' : 'bg-lime'}`} />
            <span className="leading-tight">{item}</span>
          </li>
        ))}
      </ul>

      {/* Connection dots - hidden on mobile */}
      <div className="hidden md:block absolute -left-2 top-1/2 w-4 h-4 bg-lime rounded-full border-4 border-[#f5f5f5]" />
      <div className="hidden md:block absolute -right-2 top-1/2 w-4 h-4 bg-lime rounded-full border-4 border-[#f5f5f5]" />
    </motion.div>
  );
};

const HoneycombDecoration = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute ${className} w-16 h-20 md:w-24 md:h-28`}
    viewBox="0 0 120 140"
    fill="none"
  >
    {[...Array(6)].map((_, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = col * 40 + (row % 2) * 20;
      const y = row * 35;
      const isFilled = [0, 2, 4].includes(i);
      return (
        <path
          key={i}
          d={`M${x + 20} ${y} L${x + 40} ${y + 10} L${x + 40} ${y + 30} L${x + 20} ${y + 40} L${x} ${y + 30} L${x} ${y + 10} Z`}
          fill={isFilled ? "#a3e635" : "none"}
          stroke="#a3e635"
          strokeWidth="1"
          fillOpacity={isFilled ? 0.25 : 0}
        />
      );
    })}
  </svg>
);

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#f5f5f5] overflow-hidden py-16 md:py-20">
      {/* Honeycomb decorations */}
      <HoneycombDecoration className="left-4 md:left-8 top-20 md:top-40 opacity-50 hidden sm:block" />
      <HoneycombDecoration className="right-8 md:right-16 bottom-10 md:bottom-20 opacity-40 hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header section */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
          {/* Left - Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              <span className="text-black">WE BELIEVE IN A </span>
              <span className="text-lime">PROCESS</span>
              <br className="hidden sm:block" />
              <span className="text-black">THAT WORKS</span>
            </h2>
          </motion.div>

          {/* Right - Description */}
          <motion.div
            className="flex flex-col justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6 max-w-lg">
              If you have an idea, a thought, or even just a rough direction in mind, we'd truly love to hear it. You don't need everything figured out. Sometimes a simple conversation is all it takes to find the right direction. Let's talk and see where it leads.
            </p>
            <motion.button
              className="bg-lime text-black font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-lime-dark transition-colors duration-300 w-fit text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SCHEDULE CALL
            </motion.button>
          </motion.div>
        </div>

        {/* Process flow diagram */}
        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 pointer-events-none hidden md:block"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0"
              y1="8"
              x2="100%"
              y2="8"
              stroke="#a3e635"
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </svg>

          {/* Process cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6 relative z-10">
            {processSteps.map((step, index) => (
              <ProcessCard
                key={step.title}
                title={step.title}
                items={step.items}
                variant={step.variant}
                index={index}
              />
            ))}
          </div>

          {/* Re-arrange button */}
          <motion.div
            className="flex justify-end mt-6 md:mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="bg-lime text-black font-display text-sm md:text-lg px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-lime-dark transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RE-ARRANGE
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
