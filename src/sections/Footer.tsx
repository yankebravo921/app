import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import HoneycombDecoration from '../components/HoneycombDecoration';

const footerLinks = {
    services: [
        { name: 'Web Design', href: '#services' },
        { name: 'Development', href: '#services' },
        { name: 'SEO Strategy', href: '#services' },
        { name: 'E-Commerce', href: '#services' },
    ],
    company: [
        { name: 'About Us', href: '#' },
        { name: 'Our Process', href: '#process' },
        { name: 'Work', href: '#work' },
        { name: 'Contact', href: '#contact' },
    ],
    connect: [
        { name: 'Instagram', href: '#' },
        { name: 'LinkedIn', href: '#' },
        { name: 'Twitter / X', href: '#' },
        { name: 'Dribbble', href: '#' },
    ],
};



export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer ref={ref} className="relative bg-[#0a0a0a] overflow-hidden">
            {/* Top CTA band */}
            <div className="relative bg-lime py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-end">
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

                        <motion.div
                            className="lg:pb-4 md:pb-8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <p className="text-black/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6 max-w-md">
                                Have an idea, a challenge, or a direction you want to explore? You don't need all the answers yet. Reach out and let's see what we can build together.
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

                {/* Wavy transition to dark */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
                    <svg
                        className="w-full h-10 md:h-16"
                        viewBox="0 0 1200 64"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 L0 48 Q150 64 300 48 Q450 32 600 48 Q750 64 900 48 Q1050 32 1200 48 L1200 0 Z"
                            fill="#0a0a0a"
                        />
                    </svg>
                </div>
            </div>

            {/* Main footer content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-16 md:pt-24 pb-8">
                {/* Top row: Logo + Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-16 md:mb-20">
                    {/* Brand column */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/New%20Project%20(2).png"
                                alt="Anyflow"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="font-display text-2xl text-white tracking-wide">
                                Anyflow
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                            We design immersive, motion-driven websites that command attention and guide users to act.
                        </p>
                        <div className="relative w-24 h-28">
                            <HoneycombDecoration className="inset-0 w-24 h-28 opacity-30" />
                        </div>
                    </motion.div>

                    {/* Services column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <h3 className="font-display text-sm text-lime tracking-widest mb-4 md:mb-6">
                            SERVICES
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-lime group-hover:w-3 transition-all duration-200" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <h3 className="font-display text-sm text-lime tracking-widest mb-4 md:mb-6">
                            COMPANY
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-lime group-hover:w-3 transition-all duration-200" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <h3 className="font-display text-sm text-lime tracking-widest mb-4 md:mb-6">
                            CONNECT
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.connect.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-lime group-hover:w-3 transition-all duration-200" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Divider */}
                <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.7, duration: 0.8 }}
                />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <motion.p
                        className="text-gray-600 text-xs md:text-sm"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        © {new Date().getFullYear()} Anyflow. All rights reserved.
                    </motion.p>

                    {/* Back to top */}
                    <motion.button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-gray-500 hover:text-lime transition-colors duration-200 text-xs md:text-sm group"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        whileHover={{ y: -2 }}
                    >
                        <span>Back to top</span>
                        <svg
                            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none">
                <div
                    className="w-full h-full rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(163, 230, 53, 0.4) 0%, transparent 70%)',
                    }}
                />
            </div>
        </footer>
    );
}
