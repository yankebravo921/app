import { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as THREE from 'three';
import { Environment, Center, Float } from '@react-three/drei';

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

    // Premium slow rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 20,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1,
    };

    return (
        <group ref={meshRef} scale={0.05} rotation={[0, 0, Math.PI]} position={[-10, 5, 0]}>
            <Center>
                {shapes.map((shape: THREE.Shape, i: number) => (
                    <mesh key={i} receiveShadow castShadow>
                        <extrudeGeometry args={[shape, extrudeSettings]} />
                        <meshPhysicalMaterial
                            color="#DAD8FF"
                            emissive="#6A2CFF"
                            emissiveIntensity={0.2}
                            roughness={0.15}
                            metalness={0.8}
                            clearcoat={1.0}
                            clearcoatRoughness={0.1}
                            reflectivity={1.0}
                            sheen={1.0}
                            sheenColor={new THREE.Color("#F2A0FF")}
                        />
                    </mesh>
                ))}
            </Center>
        </group>
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
                <ambientLight intensity={0.4} />
                <spotLight position={[50, 50, 50]} angle={0.3} penumbra={1} intensity={2} color="#F2A0FF" castShadow />
                <pointLight position={[-50, -50, -50]} intensity={1.5} color="#1F3BFF" />
                <pointLight position={[0, 50, -50]} intensity={2} color="#DAD8FF" />

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
