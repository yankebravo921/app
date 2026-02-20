import { useRef, useState, useEffect, useCallback } from 'react';
import {
    motion,
    useScroll,

    useMotionValueEvent,
    AnimatePresence,
} from 'framer-motion';

// ─── WORK ITEMS ──────────────────────────────────────────────────────────────

export type WorkItem = {
    id: number;
    title: string;
    category: string;
    tags: string[];
    imageSrc: string;
    year: string;
};

const WORK_ITEMS: WorkItem[] = [
    {
        id: 1,
        title: 'PAWWW',
        category: 'Brand Identity',
        tags: ['CONCEPT', '3D'],
        imageSrc: '/project1.jpg',
        year: '2024',
    },
    {
        id: 2,
        title: 'PRITAM DAS',
        category: 'Web Development',
        tags: ['WEB', 'DEVELOPMENT', 'WEBGL'],
        imageSrc: '/project2.jpg',
        year: '2024',
    },
    {
        id: 3,
        title: 'WTF RUCHIT',
        category: 'Web Design',
        tags: ['WEB', 'DESIGN', 'DEVELOPMENT'],
        imageSrc: '/project3.jpg',
        year: '2023',
    },
    {
        id: 4,
        title: 'DEEPFLOW',
        category: 'Product Design',
        tags: ['WEB', 'DEVELOPMENT'],
        imageSrc: '/project4.jpg',
        year: '2023',
    },
    {
        id: 5,
        title: 'NEONSCAPE',
        category: 'Interactive Experience',
        tags: ['WEBGL', 'MOTION', '3D'],
        imageSrc: '/project1.jpg',
        year: '2024',
    },
    {
        id: 6,
        title: 'VOIDLABS',
        category: 'Creative Direction',
        tags: ['BRANDING', 'DESIGN', 'UI/UX'],
        imageSrc: '/project2.jpg',
        year: '2023',
    },
];

// ─── CONSTANTS ───────────────────────────────────────────────────────────────



// ─── SIDE NAVIGATION DOTS ────────────────────────────────────────────────────

function SideNav({
    count,
    activeIdx,
    onDotClick,
}: {
    count: number;
    activeIdx: number;
    onDotClick: (idx: number) => void;
}) {
    return (
        <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onDotClick(i)}
                    className="group relative flex items-center"
                    aria-label={`Go to project ${i + 1}`}
                >
                    {/* Label on hover */}
                    <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-400 font-mono tracking-wider whitespace-nowrap">
                        {WORK_ITEMS[i].title}
                    </span>
                    <motion.div
                        className="rounded-full"
                        animate={{
                            width: i === activeIdx ? 10 : 6,
                            height: i === activeIdx ? 10 : 6,
                            backgroundColor: i === activeIdx ? '#a3e635' : 'rgba(255,255,255,0.2)',
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </button>
            ))}
        </div>
    );
}

// ─── SINGLE PROJECT SLIDE ────────────────────────────────────────────────────

function ProjectSlide({
    item,
    index,
    isActive,
    direction,
}: {
    item: WorkItem;
    index: number;
    isActive: boolean;
    direction: number;
}) {
    const numberStr = String(index + 1).padStart(2, '0');

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    key={item.id}
                    className="absolute inset-0 flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {/* ─── Background image with parallax & clip reveal ─── */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{
                            clipPath: direction > 0
                                ? 'inset(100% 0% 0% 0%)'
                                : 'inset(0% 0% 100% 0%)'
                        }}
                        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                        exit={{
                            clipPath: direction > 0
                                ? 'inset(0% 0% 100% 0%)'
                                : 'inset(100% 0% 0% 0%)'
                        }}
                        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                    >
                        <motion.img
                            src={item.imageSrc}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1.05 }}
                            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            draggable={false}
                        />
                        {/* Gradient overlays for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    </motion.div>

                    {/* ─── Giant project number (background decoration) ─── */}
                    <motion.div
                        className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none"
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 0.06, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span
                            className="font-display font-bold leading-none"
                            style={{ fontSize: 'clamp(200px, 30vw, 500px)', color: '#fff' }}
                        >
                            {numberStr}
                        </span>
                    </motion.div>

                    {/* ─── Content ─── */}
                    <div className="relative z-20 flex flex-col justify-end h-full w-full px-8 md:px-16 lg:px-24 pb-16 md:pb-24">
                        {/* Category */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-4"
                        >
                            <span
                                className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase"
                                style={{ color: '#a3e635' }}
                            >
                                {item.category}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-[0.9] mb-6"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {item.title}
                        </motion.h2>

                        {/* Tags + Year */}
                        <motion.div
                            className="flex items-center gap-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, delay: 0.45 }}
                        >
                            <div className="flex gap-2 flex-wrap">
                                {item.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-[10px] md:text-xs font-medium tracking-wider uppercase"
                                        style={{
                                            border: '1px solid rgba(163, 230, 53, 0.3)',
                                            color: 'rgba(163, 230, 53, 0.8)',
                                            background: 'rgba(163, 230, 53, 0.05)',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-gray-600 text-sm">—</span>
                            <span className="text-gray-500 text-sm font-mono">{item.year}</span>
                        </motion.div>

                        {/* CTA button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                        >
                            <button className="group flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/20 hover:border-lime/60 hover:bg-lime/10 transition-all duration-300">
                                <span className="text-sm font-semibold text-white tracking-wider uppercase">
                                    VIEW PROJECT
                                </span>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    <path
                                        d="M3.75 9h10.5m0 0L10.5 5.25M14.25 9l-3.75 3.75"
                                        stroke="#a3e635"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </motion.div>
                    </div>

                    {/* ─── Bottom progress bar ─── */}
                    <div className="absolute bottom-0 left-0 right-0 z-30">
                        <motion.div
                            className="h-[3px]"
                            style={{ background: '#a3e635' }}
                            initial={{ scaleX: 0, transformOrigin: 'left' }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 4, ease: 'linear' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function FeaturedWorkGallery3D() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const lastIdx = useRef(0);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Scroll-driven active index
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        const count = WORK_ITEMS.length;
        const idx = Math.min(count - 1, Math.floor(v * count));
        if (idx !== lastIdx.current) {
            setDirection(idx > lastIdx.current ? 1 : -1);
            lastIdx.current = idx;
            setActiveIdx(idx);
        }
    });

    const handleDotClick = useCallback((idx: number) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionHeight = rect.height;
        const targetScroll = sectionTop + (idx / WORK_ITEMS.length) * sectionHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }, []);

    // Total scroll height: enough space for each project
    const totalHeight = `${WORK_ITEMS.length * 120}vh`;

    return (
        <div ref={sectionRef} className="relative" style={{ height: isMobile ? 'auto' : totalHeight }}>
            {/* Sticky viewport */}
            <div
                className={`${isMobile ? '' : 'sticky top-0'} w-full overflow-hidden`}
                style={{ height: isMobile ? 'auto' : '100vh', background: '#000' }}
            >
                {/* Section label */}
                <div className="absolute top-8 md:top-12 left-8 md:left-16 lg:left-24 z-30">
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-8 h-px bg-lime" />
                        <span className="text-xs font-mono tracking-[0.4em] uppercase text-gray-400">
                            FEATURED WORK
                        </span>
                    </motion.div>
                </div>

                {/* Counter */}
                <div className="absolute top-8 md:top-12 right-20 md:right-28 z-30">
                    <div className="font-mono text-sm tabular-nums">
                        <span className="text-white text-2xl font-bold">
                            {String(activeIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-gray-600 mx-2">/</span>
                        <span className="text-gray-500">
                            {String(WORK_ITEMS.length).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {isMobile ? (
                    /* ─── Mobile: stacked cards ─── */
                    <div className="px-4 py-20 flex flex-col gap-6">
                        {WORK_ITEMS.map((item) => (
                            <div key={item.id} className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
                                <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: '#a3e635' }}>
                                        {item.category}
                                    </span>
                                    <h3 className="font-display text-3xl text-white mt-1 leading-tight">{item.title}</h3>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase"
                                                style={{ border: '1px solid rgba(163,230,53,0.3)', color: 'rgba(163,230,53,0.7)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ─── Desktop: full-screen slides ─── */
                    <div className="relative w-full h-full">
                        {WORK_ITEMS.map((item, i) => (
                            <ProjectSlide
                                key={item.id}
                                item={item}
                                index={i}
                                isActive={i === activeIdx}
                                direction={direction}
                            />
                        ))}
                    </div>
                )}

                {/* Side nav dots (desktop only) */}
                {!isMobile && (
                    <SideNav count={WORK_ITEMS.length} activeIdx={activeIdx} onDotClick={handleDotClick} />
                )}
            </div>
        </div>
    );
}
