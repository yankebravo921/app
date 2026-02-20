import { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as THREE from 'three';
import { Environment, Center, Float } from '@react-three/drei';

/* ── Procedural grass texture generator ───────────────────────────── */
function createGrassTexture(size = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Dark base (simulates soil / dark gaps between grass) — brighter to match #a3e635
    ctx.fillStyle = '#4a8018';
    ctx.fillRect(0, 0, size, size);

    // Dark gap patches for depth
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const w = 2 + Math.random() * 6;
        const h = 2 + Math.random() * 4;
        ctx.fillStyle = `rgba(20, 50, 5, ${0.3 + Math.random() * 0.4})`;
        ctx.fillRect(x, y, w, h);
    }

    // Draw many grass strands — thicker and brighter for visibility
    const strandCount = 5000;
    for (let i = 0; i < strandCount; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const length = 6 + Math.random() * 14;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
        const width = 1 + Math.random() * 2.5;

        // Bright greens that stand out against dark base
        const greens = ['#6db82a', '#82c43e', '#a3e635', '#9ad440', '#b5e86a', '#c4f070', '#8cbf30', '#a3e635'];
        ctx.strokeStyle = greens[Math.floor(Math.random() * greens.length)];
        ctx.lineWidth = width;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
        const cx = x + Math.cos(angle) * length * 0.5 + (Math.random() - 0.5) * 4;
        const cy = y + Math.sin(angle) * length * 0.5;
        const ex = x + Math.cos(angle) * length;
        const ey = y + Math.sin(angle) * length;
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.stroke();
    }

    // White highlight dots — scattered bright specks
    for (let i = 0; i < 400; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 0.5 + Math.random() * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Extra bright lime highlights
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 1 + Math.random() * 2.5;
        ctx.fillStyle = `rgba(200, 245, 100, ${0.25 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
}

/* ── Procedural bump map for uneven surface ───────────────────────── */
function createGrassBumpMap(size = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Medium gray base
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Random noise for fibrous feel
    for (let i = 0; i < 6000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const length = 3 + Math.random() * 8;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
        const brightness = 100 + Math.floor(Math.random() * 155);

        ctx.strokeStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        ctx.lineWidth = 0.5 + Math.random() * 1;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
}

function LogoShape({ url }: { url: string }) {
    const data = useLoader(SVGLoader, url);
    const meshRef = useRef<THREE.Group>(null!);

    const shapes = useMemo(() => {
        const allShapes: THREE.Shape[] = [];
        data.paths.forEach((path: { toShapes: (arg0: boolean) => THREE.Shape[] }) => {
            const s = path.toShapes(true);
            allShapes.push(...s);
        });
        return allShapes;
    }, [data]);

    // Generate textures once
    const grassMap = useMemo(() => createGrassTexture(), []);
    const bumpMap = useMemo(() => createGrassBumpMap(), []);

    // Premium slow rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 45,
        bevelEnabled: true,
        bevelSegments: 12,
        steps: 3,
        bevelSize: 1.5,
        bevelThickness: 1.5,
    };

    return (
        <group ref={meshRef} scale={0.05} rotation={[0, 0, Math.PI]} position={[-10, 5, 0]}>
            <Center>
                {shapes.map((shape: THREE.Shape, i: number) => (
                    <ExtrudedMesh
                        key={i}
                        shape={shape}
                        extrudeSettings={extrudeSettings}
                        grassMap={grassMap}
                        bumpMap={bumpMap}
                    />
                ))}
            </Center>
        </group>
    );
}

/* ── Custom mesh that computes UVs for texture mapping ──────────── */
function ExtrudedMesh({
    shape,
    extrudeSettings,
    grassMap,
    bumpMap,
}: {
    shape: THREE.Shape;
    extrudeSettings: THREE.ExtrudeGeometryOptions;
    grassMap: THREE.CanvasTexture;
    bumpMap: THREE.CanvasTexture;
}) {
    const meshRef = useRef<THREE.Mesh>(null!);

    const geometry = useMemo(() => {
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Compute normals for tri-planar UV projection
        geo.computeVertexNormals();
        geo.computeBoundingBox();
        const bb = geo.boundingBox!;
        const size = new THREE.Vector3();
        bb.getSize(size);

        const pos = geo.attributes.position;
        const norm = geo.attributes.normal;
        const uvs = new Float32Array(pos.count * 2);

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const nx = Math.abs(norm.getX(i));
            const ny = Math.abs(norm.getY(i));
            const nz = Math.abs(norm.getZ(i));

            // Tri-planar: pick UV axes based on dominant normal direction
            if (nz >= nx && nz >= ny) {
                // Front/back faces → project XY
                uvs[i * 2] = (x - bb.min.x) / size.x;
                uvs[i * 2 + 1] = (y - bb.min.y) / size.y;
            } else if (nx >= ny) {
                // Side faces (left/right) → project YZ
                uvs[i * 2] = (z - bb.min.z) / size.z;
                uvs[i * 2 + 1] = (y - bb.min.y) / size.y;
            } else {
                // Top/bottom edges → project XZ
                uvs[i * 2] = (x - bb.min.x) / size.x;
                uvs[i * 2 + 1] = (z - bb.min.z) / size.z;
            }
        }

        geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        return geo;
    }, [shape, extrudeSettings]);

    return (
        <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
            <meshPhysicalMaterial
                map={grassMap}
                bumpMap={bumpMap}
                bumpScale={2.5}
                color="#a3e635"
                emissive="#6aaa20"
                emissiveIntensity={0.2}
                roughness={0.6}
                metalness={0.15}
                clearcoat={0.8}
                clearcoatRoughness={0.1}
                sheen={1.0}
                sheenRoughness={0.6}
                sheenColor={new THREE.Color("#c4e878")}
                envMapIntensity={1.2}
            />
        </mesh>
    );
}

export default function ThreeDLogo() {
    return (
        <div className="w-full h-full relative">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 140], fov: 35 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <ambientLight intensity={0.8} />
                <spotLight position={[50, 50, 50]} angle={0.3} penumbra={1} intensity={2.5} color="#ffffff" castShadow />
                <pointLight position={[-50, -50, -50]} intensity={1.5} color="#a3e635" />
                <pointLight position={[0, 50, -50]} intensity={2} color="#ffffff" />
                {/* Specular reflection light — creates a bright highlight sweep */}
                <spotLight position={[30, 30, 80]} angle={0.5} penumbra={0.8} intensity={3} color="#ffffff" />

                <Environment preset="city" />

                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                        <LogoShape url="/logo.svg" />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}
