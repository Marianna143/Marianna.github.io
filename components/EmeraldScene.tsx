"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function EmeraldAura() {
    const mesh = useRef<THREE.Mesh>(null!);
    const { mouse } = useThree();

    useFrame((state) => {
        const { clock } = state;

        // Base rotation
        mesh.current.rotation.x = clock.getElapsedTime() * 0.1;
        mesh.current.rotation.y = clock.getElapsedTime() * 0.12;

        // Mouse responsiveness (lerp for smoothness)
        // Position following
        const targetX = mouse.x * 1.5;
        const targetY = mouse.y * 1.5;

        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.05);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.05);

        // Subtle rotation follow
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetY * 0.5, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetX * 0.5, 0.1);
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere args={[1, 64, 64]} scale={2.5} ref={mesh}>
                <MeshDistortMaterial
                    color="#10b981"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={0.9}
                    emissive="#059669"
                    emissiveIntensity={0.4}
                />
            </Sphere>
        </Float>
    );
}

export default function EmeraldScene() {
    const containerRef = useRef<HTMLDivElement>(null!);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] opacity-60 pointer-events-none bg-black">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                eventSource={typeof document !== 'undefined' ? document.body : undefined}
                eventPrefix="client"
            >
                <color attach="background" args={["#000000"]} />
                <Stars
                    radius={100}
                    depth={50}
                    count={7000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1.5}
                />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#064e3b" />
                <spotLight position={[0, 10, 0]} intensity={2.5} color="#ffffff" angle={0.4} penumbra={1} />
                <EmeraldAura />
            </Canvas>
        </div>
    );
}


