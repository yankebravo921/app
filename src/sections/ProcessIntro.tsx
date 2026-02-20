import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import HoneycombDecoration from '../components/HoneycombDecoration';

/**
 * ProcessIntro — "WE BELIEVE IN A PROCESS THAT WORKS" headline + paragraph + CTA.
 * Rendered directly above <InteractiveProcessMap />.
 *
 * To edit the intro text, update the <h2> and <p> content below.
 */

export default function ProcessIntro() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative bg-[#f5f5f5] overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12">
            {/* Honeycomb decorations */}
            <HoneycombDecoration className="left-4 md:left-8 top-16 md:top-32 w-48 h-56 md:w-60 md:h-68 opacity-50 hidden sm:block" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header section */}
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
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
            </div>
        </section>
    );
}
