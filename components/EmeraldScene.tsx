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
                    radius={240}
                    depth={140}
                    count={1500}
                    factor={1.55}
                    saturation={0}
                    fade
                    speed={0.07}
                />
            </group>

            <group ref={midRef}>
                <Stars
                    radius={140}
                    depth={90}
                    count={1000}
                    factor={1.85}
                    saturation={0}
                    fade
                    speed={0.11}
                />
            </group>

            <Stars
                radius={72}
                depth={32}
                count={360}
                factor={2.3}
                saturation={0}
                fade
                speed={0.16}
            />
        </>
    );
}

export default function EmeraldScene() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black relative overflow-hidden" style={{ opacity: 0.6 }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 1.25]}
                gl={{ antialias: false, alpha: true }}
                eventSource={document.body}
                eventPrefix="client"
            >
                <color attach="background" args={["#000000"]} />
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
