import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'PAWWW',
    tags: ['CONCEPT', '3D'],
    image: '/project1.jpg',
    layout: 'left',
  },
  {
    id: 2,
    title: 'PRITAM DAS',
    tags: ['WEB', 'DEVELOPMENT', 'WEBGL'],
    image: '/project2.jpg',
    layout: 'right',
  },
  {
    id: 3,
    title: 'WTF RUCHIT',
    tags: ['WEB', 'DESIGN', 'DEVELOPMENT'],
    image: '/project3.jpg',
    layout: 'left',
  },
  {
    id: 4,
    title: 'DEEPFLOW',
    tags: ['WEB', 'DEVELOPMENT'],
    image: '/project4.jpg',
    layout: 'right',
  },
];

const ProjectCard = ({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLeft = project.layout === 'left';

  return (
    <motion.div
      className={`relative ${isLeft ? 'lg:col-start-1' : 'lg:col-start-2'}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <motion.div
        className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-[4/3] relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Hover overlay with Live Site */}
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex items-center gap-2 text-white font-semibold text-sm md:text-base"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              <span>LIVE SITE</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Project info */}
      <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 md:gap-2">
        <motion.h3
          className="font-display text-xl md:text-2xl lg:text-3xl text-black"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2 }}
        >
          {project.title}
        </motion.h3>
        <motion.div
          className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm text-black/70"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.3 }}
        >
          {project.tags.map((tag, i) => (
            <span key={tag} className="flex items-center">
              {tag}
              {i < project.tags.length - 1 && (
                <span className="mx-1 md:mx-2 w-1 h-1 bg-black/50 rounded-full" />
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const SpeedLines = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {[...Array(12)].map((_, i) => {
        const angle = -30 + i * 5;
        return (
          <motion.line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 80 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 80 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="0.3"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          />
        );
      })}
    </svg>
  );
};

export default function FeaturedWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-lime overflow-hidden py-16 md:py-20">
      {/* Speed lines effect */}
      <SpeedLines />

      {/* Top edge decoration */}
      <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-[#f5f5f5]">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 32"
          preserveAspectRatio="none"
        >
          <path
            d="M0 32 L0 16 Q100 0 200 16 Q300 32 400 16 Q500 0 600 16 Q700 32 800 16 Q900 0 1000 16 Q1100 32 1200 16 L1200 32 Z"
            fill="#a3e635"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black">
            FEATURED WORK
          </h2>
          {/* Underline */}
          <motion.div
            className="w-32 md:w-48 h-1 bg-black mx-auto mt-3 md:mt-4"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
