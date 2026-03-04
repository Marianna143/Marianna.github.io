"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

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
                    radius={260}
                    depth={155}
                    count={1150}
                    factor={1.25}
                    saturation={0}
                    fade
                    speed={0.05}
                />
            </group>

            <group ref={midRef}>
                <Stars
                    radius={150}
                    depth={95}
                    count={820}
                    factor={1.45}
                    saturation={0}
                    fade
                    speed={0.08}
                />
            </group>

            <Stars
                radius={78}
                depth={36}
                count={260}
                factor={1.9}
                saturation={0}
                fade
                speed={0.12}
            />
        </>
    );
}

export default function EmeraldScene() {
    return (
        <div
            className="fixed inset-0 z-[-1] pointer-events-none bg-black relative overflow-hidden"
            style={{ opacity: 0.62 }}
        >
            <Canvas
                camera={{ position: [0, 0, 6], fov: 68 }}
                dpr={[1, 1.25]}
                gl={{ antialias: false, alpha: true }}
                eventSource={typeof document !== "undefined" ? document.body : undefined}
                eventPrefix="client"
            >
                <color attach="background" args={["#000000"]} />
                <ambientLight intensity={0.46} />
                <pointLight position={[4.5, 3.5, 5.5]} intensity={0.74} color="#6ee7b7" />
                <pointLight position={[-4.5, -3.5, -3]} intensity={0.42} color="#047857" />
                <DeepStarLayers />
            </Canvas>

            <div className="shooting-stars">
                <span className="shooting-star star-a" />
                <span className="shooting-star star-b" />
                <span className="shooting-star star-c" />
            </div>
        </div>
    );
}
