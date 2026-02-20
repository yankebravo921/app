import { useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════
//  HONEYCOMB DECORATION — smooth 60fps animated wave
//  Shared component used across Hero, Services, ProcessIntro, Footer
// ═══════════════════════════════════════════════════════════════════════

const HEX_SIZE = 36;
const SQRT3 = Math.sqrt(3);
const X_SP = SQRT3 * HEX_SIZE;
const Y_SP = 1.5 * HEX_SIZE;
const HALF_X = X_SP / 2;
const TWO_PI = 2 * Math.PI;

const STROKE_CLR = '#a3e635';
const FILL_CLR = '#B7FF66';
const GLOW_CLR = '#B7FF66';
const CYCLE_S = 5;
const WAVE_WIDTH = 1.2;
const SHARPNESS = 1.8;
const PASSIVE_IDS = [1, 4, 11, 16, 18];

const hexDefs = [
    { id: 0, col: 3, row: 0 }, { id: 1, col: 4, row: 0 },
    { id: 2, col: 2, row: 1 }, { id: 3, col: 3, row: 1 }, { id: 4, col: 4, row: 1 },
    { id: 5, col: 1, row: 2 }, { id: 6, col: 2, row: 2 }, { id: 7, col: 3, row: 2 },
    { id: 8, col: 0, row: 3 }, { id: 9, col: 1, row: 3 }, { id: 10, col: 2, row: 3 }, { id: 11, col: 3, row: 3 },
    { id: 12, col: 1, row: 4 }, { id: 13, col: 2, row: 4 }, { id: 14, col: 3, row: 4 },
    { id: 15, col: 2, row: 5 }, { id: 16, col: 3, row: 5 },
    { id: 17, col: 3, row: 6 }, { id: 18, col: 4, row: 6 },
];

// Pre-compute hex pixel positions and wave phases
const hexData = (() => {
    const raw = hexDefs.map(h => ({
        id: h.id,
        cx: h.col * X_SP + (h.row % 2 === 1 ? HALF_X : 0),
        cy: h.row * Y_SP,
        diag: h.row + h.col * 0.6,
        perp: h.row - h.col * 0.4,
        isPassive: PASSIVE_IDS.includes(h.id),
    }));
    const dMin = Math.min(...raw.map(h => h.diag));
    const dMax = Math.max(...raw.map(h => h.diag));
    const pMin = Math.min(...raw.map(h => h.perp));
    const pMax = Math.max(...raw.map(h => h.perp));
    return raw.map(h => ({
        ...h,
        phase1: (h.diag - dMin) / (dMax - dMin),
        phase2: (h.perp - pMin) / (pMax - pMin),
    }));
})();

function hexPoints(cx: number, cy: number, size: number): string {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i - 30);
        pts.push(`${(cx + size * Math.cos(a)).toFixed(2)},${(cy + size * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(' ');
}

// Unique filter ID counter to avoid SVG filter collisions when multiple instances exist
let instanceCounter = 0;

export default function HoneycombDecoration({ className = '' }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const rafId = useRef<number>(0);
    const filterId = useRef(`hc-glow-${instanceCounter++}`);

    const animate = useCallback((timestamp: number) => {
        const svg = svgRef.current;
        if (!svg) return;

        const t = timestamp / 1000;
        const omega = TWO_PI / CYCLE_S;

        for (let i = 0; i < hexData.length; i++) {
            const h = hexData[i];
            let brightness: number;

            if (h.isPassive) {
                brightness = 0;
            } else {
                const w1 = Math.sin(t * omega - h.phase1 * TWO_PI * WAVE_WIDTH);
                const w2 = Math.sin(t * omega * 0.55 - h.phase2 * TWO_PI * 0.9);
                const combined = w1 * 0.72 + w2 * 0.28;
                brightness = combined > 0 ? Math.pow(combined, SHARPNESS) : 0;
            }

            const glowEl = svg.querySelector(`[data-glow="${h.id}"]`);
            const mainEl = svg.querySelector(`[data-main="${h.id}"]`);
            if (glowEl && mainEl) {
                glowEl.setAttribute('opacity', brightness.toFixed(3));
                mainEl.setAttribute('fill-opacity', (brightness * 0.9).toFixed(3));
                mainEl.setAttribute('stroke-opacity', (h.isPassive ? 0.45 : 0.6 + brightness * 0.4).toFixed(3));
            }
        }

        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        rafId.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId.current);
    }, [animate]);

    const fId = filterId.current;

    return (
        <svg
            ref={svgRef}
            className={`absolute ${className}`}
            viewBox="-60 -80 430 510"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id={fId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
                    <feMerge>
                        <feMergeNode in="blur1" />
                        <feMergeNode in="blur2" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {hexData.map(h => {
                const pts = hexPoints(h.cx, h.cy, HEX_SIZE);
                return (
                    <g key={h.id}>
                        <polygon
                            data-glow={h.id}
                            points={pts}
                            fill={GLOW_CLR}
                            fillOpacity={0.35}
                            filter={`url(#${fId})`}
                            stroke="none"
                            opacity={0}
                        />
                        <polygon
                            data-main={h.id}
                            points={pts}
                            fill={FILL_CLR}
                            fillOpacity={0}
                            stroke={STROKE_CLR}
                            strokeWidth={2}
                            strokeOpacity={h.isPassive ? 0.45 : 0.6}
                        />
                    </g>
                );
            })}
        </svg>
    );
}
