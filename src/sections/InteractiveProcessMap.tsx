import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

// ─── NODE DATA ───────────────────────────────────────────────────────────────
// To add/remove nodes: edit this array and the EDGES array below.

type NodeId = 'discovery' | 'concept' | 'design' | 'develop' | 'polish' | 'launch';

interface ProcessNode {
    id: NodeId;
    title: string;
    items: string[];
    variant: 'lime' | 'dark';
}

const NODES: ProcessNode[] = [
    { id: 'discovery', title: 'DISCOVERY', items: ['Creative Brief', 'Brand Research', 'Mood Boards'], variant: 'lime' },
    { id: 'concept', title: 'CONCEPT', items: ['Visual Direction', 'Art Direction', 'Storyboarding'], variant: 'dark' },
    { id: 'design', title: 'DESIGN', items: ['UI/UX Craft', 'Motion Design', 'Interaction Design'], variant: 'lime' },
    { id: 'develop', title: 'DEVELOP', items: ['Creative Coding', 'WebGL & 3D', 'Animations'], variant: 'dark' },
    { id: 'polish', title: 'POLISH', items: ['Micro-interactions', 'Performance', 'Pixel Perfect'], variant: 'lime' },
    { id: 'launch', title: 'LAUNCH', items: ['Go Live', 'Case Study', 'Awards Submit'], variant: 'dark' },
];

// ─── EDGES (connectors) ─────────────────────────────────────────────────────
// To add/remove connectors: edit this array.
const EDGES: [NodeId, NodeId][] = [
    ['discovery', 'concept'],
    ['discovery', 'design'],
    ['design', 'concept'],
    ['design', 'develop'],
    ['concept', 'polish'],
    ['develop', 'polish'],
    ['polish', 'launch'],
];

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const NODE_W = 180;
const NODE_H = 150;
const ANCHOR_R = 5;      // radius of endpoint dots
const HANDLE_R = 6;      // radius of visible handle dots on block edges
const MOBILE_BP = 768;   // px breakpoint for mobile fallback

// ─── INITIAL LAYOUT (% of container) ────────────────────────────────────────
// To change initial positions: adjust these normalised x/y values (0–1).
const INITIAL_LAYOUT: Record<NodeId, { x: number; y: number }> = {
    discovery: { x: 0.04, y: 0.35 },
    concept: { x: 0.25, y: 0.05 },
    design: { x: 0.30, y: 0.55 },
    develop: { x: 0.52, y: 0.60 },
    polish: { x: 0.62, y: 0.15 },
    launch: { x: 0.82, y: 0.38 },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

type Side = 'left' | 'right' | 'top' | 'bottom';

/** Returns the anchor point on the nearest side of a rectangle to a target point. */
function getAnchor(
    pos: { x: number; y: number },
    w: number,
    h: number,
    targetPos: { x: number; y: number },
): { x: number; y: number; side: Side } {
    const cx = pos.x + w / 2;
    const cy = pos.y + h / 2;
    const tx = targetPos.x + w / 2;
    const ty = targetPos.y + h / 2;
    const dx = tx - cx;
    const dy = ty - cy;

    // Determine which side to anchor on based on direction to target
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
        // Horizontal dominant
        if (dx > 0) return { x: pos.x + w, y: pos.y + h / 2, side: 'right' };
        return { x: pos.x, y: pos.y + h / 2, side: 'left' };
    }
    // Vertical dominant
    if (dy > 0) return { x: pos.x + w / 2, y: pos.y + h, side: 'bottom' };
    return { x: pos.x + w / 2, y: pos.y, side: 'top' };
}

/** Builds a cubic Bézier path string with horizontal-bias control points. */
function buildCurvePath(
    from: { x: number; y: number; side: Side },
    to: { x: number; y: number; side: Side },
): string {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    let cp1x: number, cp1y: number, cp2x: number, cp2y: number;

    // Create smooth horizontal-biased curves
    const offsetX = Math.max(Math.abs(dx) * 0.45, 40);
    const offsetY = Math.max(Math.abs(dy) * 0.45, 40);

    if (from.side === 'right') {
        cp1x = from.x + offsetX;
        cp1y = from.y;
    } else if (from.side === 'left') {
        cp1x = from.x - offsetX;
        cp1y = from.y;
    } else if (from.side === 'bottom') {
        cp1x = from.x;
        cp1y = from.y + offsetY;
    } else {
        cp1x = from.x;
        cp1y = from.y - offsetY;
    }

    if (to.side === 'right') {
        cp2x = to.x + offsetX;
        cp2y = to.y;
    } else if (to.side === 'left') {
        cp2x = to.x - offsetX;
        cp2y = to.y;
    } else if (to.side === 'bottom') {
        cp2x = to.x;
        cp2y = to.y + offsetY;
    } else {
        cp2x = to.x;
        cp2y = to.y - offsetY;
    }

    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
}

// ─── MOBILE CARD ─────────────────────────────────────────────────────────────

function MobileProcessCard({ node, index }: { node: ProcessNode; index: number }) {
    const isLime = node.variant === 'lime';
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.3 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="flex items-start gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-4 ${isLime ? 'bg-lime border-lime-dark' : 'bg-gray-700 border-gray-600'}`} />
                {index < NODES.length - 1 && <div className="w-0.5 h-full bg-gray-300 min-h-[80px]" />}
            </div>

            {/* Card */}
            <div
                ref={ref}
                className={`rounded-xl p-4 flex-1 shadow-md transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                    } ${isLime ? 'bg-lime' : 'bg-[#141414]'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
            >
                <h3 className={`font-display text-sm mb-2 ${isLime ? 'text-black' : 'text-white'}`}>
                    {node.title}
                </h3>
                <ul className="space-y-1">
                    {node.items.map((item, i) => (
                        <li key={i} className={`text-xs flex items-start gap-1.5 ${isLime ? 'text-black/80' : 'text-lime'}`}>
                            <span className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${isLime ? 'bg-black' : 'bg-lime'}`} />
                            <span className="leading-tight">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function InteractiveProcessMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<Record<NodeId, { x: number; y: number }> | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [draggingId, setDraggingId] = useState<NodeId | null>(null);
    const [hasEntered, setHasEntered] = useState(false);
    const dragStartRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

    // ── Measure container & compute initial positions ──
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const update = () => {
            const w = container.clientWidth;
            const mobile = w < MOBILE_BP;
            setIsMobile(mobile);
            if (mobile) return;

            const h = container.clientHeight;
            const pad = 16;
            const init: Record<string, { x: number; y: number }> = {};
            for (const [id, pct] of Object.entries(INITIAL_LAYOUT)) {
                init[id] = {
                    x: Math.round(pct.x * (w - NODE_W - pad * 2) + pad),
                    y: Math.round(pct.y * (h - NODE_H - pad * 2) + pad),
                };
            }
            setPositions(init as Record<NodeId, { x: number; y: number }>);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    // ── Entrance animation via IntersectionObserver ──
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setHasEntered(true); obs.disconnect(); } },
            { threshold: 0.15 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // ── Drag handlers ──
    const onPointerDown = useCallback((e: React.PointerEvent, id: NodeId) => {
        if (isMobile) return;
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        const pos = positions?.[id];
        if (!pos) return;
        dragStartRef.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
        setDraggingId(id);
    }, [isMobile, positions]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!draggingId || !dragStartRef.current || !containerRef.current) return;
        const { px, py, ox, oy } = dragStartRef.current;
        const container = containerRef.current;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const pad = 8;

        const nx = Math.max(pad, Math.min(cw - NODE_W - pad, ox + (e.clientX - px)));
        const ny = Math.max(pad, Math.min(ch - NODE_H - pad, oy + (e.clientY - py)));

        setPositions(prev => prev ? { ...prev, [draggingId]: { x: nx, y: ny } } : prev);
    }, [draggingId]);

    const onPointerUp = useCallback(() => {
        setDraggingId(null);
        dragStartRef.current = null;
    }, []);

    // ── Compute SVG connector paths ──
    const connectors = useMemo(() => {
        if (!positions) return [];
        return EDGES.map(([fromId, toId]) => {
            const fromPos = positions[fromId];
            const toPos = positions[toId];
            const fromAnchor = getAnchor(fromPos, NODE_W, NODE_H, toPos);
            const toAnchor = getAnchor(toPos, NODE_W, NODE_H, fromPos);
            const d = buildCurvePath(fromAnchor, toAnchor);
            return { fromId, toId, d, fromAnchor, toAnchor };
        });
    }, [positions]);

    // ── Mobile layout ──
    if (isMobile) {
        return (
            <section className="bg-[#f5f5f5] px-4 sm:px-6 pb-12">
                <div className="max-w-md mx-auto space-y-0">
                    {NODES.map((node, i) => (
                        <MobileProcessCard key={node.id} node={node} index={i} />
                    ))}
                </div>
            </section>
        );
    }

    // ── Desktop draggable canvas ──
    return (
        <section className="bg-[#f5f5f5] overflow-hidden pb-12 md:pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div
                    ref={containerRef}
                    className="relative w-full select-none"
                    style={{ height: '80vh', minHeight: 500, maxHeight: 800 }}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                >
                    {/* SVG connector overlay */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ zIndex: 0 }}
                    >
                        {connectors.map(({ fromId, toId, d, fromAnchor, toAnchor }, i) => (
                            <g
                                key={`${fromId}-${toId}`}
                                style={{
                                    opacity: hasEntered ? 1 : 0,
                                    transition: `opacity 0.6s ease ${0.4 + i * 0.08}s`,
                                }}
                            >
                                {/* Path */}
                                <path
                                    d={d}
                                    fill="none"
                                    stroke="#d1d5db"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                {/* Start dot */}
                                <circle
                                    cx={fromAnchor.x}
                                    cy={fromAnchor.y}
                                    r={ANCHOR_R}
                                    fill="white"
                                    stroke="#d1d5db"
                                    strokeWidth="1.5"
                                />
                                {/* End dot */}
                                <circle
                                    cx={toAnchor.x}
                                    cy={toAnchor.y}
                                    r={ANCHOR_R}
                                    fill="white"
                                    stroke="#d1d5db"
                                    strokeWidth="1.5"
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Draggable blocks */}
                    {positions && NODES.map((node, idx) => {
                        const pos = positions[node.id];
                        const isLime = node.variant === 'lime';
                        const isDragging = draggingId === node.id;

                        return (
                            <div
                                key={node.id}
                                className="absolute touch-none"
                                style={{
                                    left: pos.x,
                                    top: pos.y,
                                    width: NODE_W,
                                    height: NODE_H,
                                    zIndex: isDragging ? 20 : 10,
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    opacity: hasEntered ? 1 : 0,
                                    transform: hasEntered
                                        ? 'translateY(0)'
                                        : 'translateY(30px)',
                                    transition: isDragging
                                        ? 'box-shadow 0.2s, opacity 0.5s ease, transform 0.5s ease'
                                        : 'left 0.05s linear, top 0.05s linear, box-shadow 0.2s, opacity 0.5s ease, transform 0.5s ease',
                                    transitionDelay: hasEntered ? '0s' : `${idx * 0.1}s`,
                                }}
                                onPointerDown={(e) => onPointerDown(e, node.id)}
                            >
                                {/* Card */}
                                <div
                                    className={`w-full h-full rounded-xl p-4 relative overflow-hidden ${isLime ? 'bg-lime' : 'bg-[#141414]'
                                        }`}
                                    style={{
                                        boxShadow: isDragging
                                            ? '0 12px 32px rgba(0,0,0,0.18)'
                                            : '0 4px 12px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    <h3 className={`font-display text-sm mb-2 ${isLime ? 'text-black' : 'text-white'}`}>
                                        {node.title}
                                    </h3>
                                    <ul className="space-y-1">
                                        {node.items.map((item, i) => (
                                            <li
                                                key={i}
                                                className={`text-xs flex items-start gap-1.5 ${isLime ? 'text-black/80' : 'text-lime'
                                                    }`}
                                            >
                                                <span className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${isLime ? 'bg-black' : 'bg-lime'}`} />
                                                <span className="leading-tight">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Handle dots (visible anchors on card edges) */}
                                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" style={{ width: HANDLE_R * 2, height: HANDLE_R * 2 }} />
                                    </div>
                                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                                        <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" style={{ width: HANDLE_R * 2, height: HANDLE_R * 2 }} />
                                    </div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" style={{ width: HANDLE_R * 2, height: HANDLE_R * 2 }} />
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                                        <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" style={{ width: HANDLE_R * 2, height: HANDLE_R * 2 }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
