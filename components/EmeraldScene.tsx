"use client";

import { useRef } from "react";
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
        const targetY = mouse.y * 1.2 - 0.72;

        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.05);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.05);

        // Subtle rotation follow
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetY * 0.5, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetX * 0.5, 0.1);
    });

    return (
        <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.65}>
            <Sphere args={[1, 44, 44]} scale={2.18} ref={mesh}>
                <MeshDistortMaterial
                    color="#10b981"
                    attach="material"
                    distort={0.22}
                    speed={1}
                    roughness={0.15}
                    metalness={0.78}
                    emissive="#059669"
                    emissiveIntensity={0.2}
                />
            </Sphere>
        </Float>
    );
}

function DeepStarLayers() {
    const farRef = useRef<THREE.Group>(null!);
    const midRef = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        farRef.current.rotation.y -= delta * 0.003;
        farRef.current.rotation.x = Math.sin(time * 0.09) * 0.025;

        midRef.current.rotation.y += delta * 0.006;
        midRef.current.rotation.x = Math.cos(time * 0.08) * 0.03;
    });

    return (
        <>
            <group ref={farRef}>
                <Stars
                    radius={210}
                    depth={120}
                    count={620}
                    factor={0.95}
                    saturation={0}
                    fade
                    speed={0.04}
                />
            </group>

            <group ref={midRef}>
                <Stars
                    radius={130}
                    depth={72}
                    count={360}
                    factor={1.35}
                    saturation={0}
                    fade
                    speed={0.08}
                />
            </group>
        </>
    );
}

export default function EmeraldScene() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black/95 relative overflow-hidden" style={{ opacity: 0.43 }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 1.25]}
                gl={{ antialias: false, alpha: true }}
                eventSource={document.body}
                eventPrefix="client"
            >
                <color attach="background" args={["#000000"]} />
                <DeepStarLayers />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#064e3b" />
                <spotLight position={[0, 10, 0]} intensity={2.5} color="#ffffff" angle={0.4} penumbra={1} />
                <EmeraldAura />
            </Canvas>

            <div className="shooting-stars">
                <span className="shooting-star star-a" />
                <span className="shooting-star star-b" />
                <span className="shooting-star star-c" />
            </div>
        </div>
    );
}
