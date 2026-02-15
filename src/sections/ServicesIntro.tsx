import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ServicesIntro() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="bg-[#f5f5f5] pt-20 pb-10 flex justify-center items-center relative z-10">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                    <span className="text-black">WE ARE </span>
                    <span className="text-lime">GOOD</span>
                    <span className="text-black"> AT</span>
                </h2>
            </motion.div>
        </section>
    );
}
