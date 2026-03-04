"use client";

import { useRef, type CSSProperties } from "react";
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

type ShootingStarStyle = CSSProperties & {
    "--meteor-x": string;
    "--meteor-y": string;
    "--meteor-mid-x": string;
    "--meteor-mid-y": string;
    "--meteor-end-x": string;
    "--meteor-end-y": string;
    "--meteor-angle": string;
    "--meteor-duration": string;
    "--meteor-delay": string;
};

const shootingStarStyles: ShootingStarStyle[] = [
    {
        "--meteor-x": "108vw",
        "--meteor-y": "8vh",
        "--meteor-mid-x": "-22vw",
        "--meteor-mid-y": "12vh",
        "--meteor-end-x": "-30vw",
        "--meteor-end-y": "18vh",
        "--meteor-angle": "-24deg",
        "--meteor-duration": "68s",
        "--meteor-delay": "-11s",
    },
    {
        "--meteor-x": "105vw",
        "--meteor-y": "24vh",
        "--meteor-mid-x": "-20vw",
        "--meteor-mid-y": "10vh",
        "--meteor-end-x": "-28vw",
        "--meteor-end-y": "15vh",
        "--meteor-angle": "-18deg",
        "--meteor-duration": "82s",
        "--meteor-delay": "-37s",
    },
    {
        "--meteor-x": "106vw",
        "--meteor-y": "46vh",
        "--meteor-mid-x": "-24vw",
        "--meteor-mid-y": "8vh",
        "--meteor-end-x": "-34vw",
        "--meteor-end-y": "13vh",
        "--meteor-angle": "-14deg",
        "--meteor-duration": "74s",
        "--meteor-delay": "-52s",
    },
    {
        "--meteor-x": "107vw",
        "--meteor-y": "68vh",
        "--meteor-mid-x": "-18vw",
        "--meteor-mid-y": "7vh",
        "--meteor-end-x": "-26vw",
        "--meteor-end-y": "11vh",
        "--meteor-angle": "-16deg",
        "--meteor-duration": "91s",
        "--meteor-delay": "-24s",
    },
    {
        "--meteor-x": "-12vw",
        "--meteor-y": "14vh",
        "--meteor-mid-x": "20vw",
        "--meteor-mid-y": "11vh",
        "--meteor-end-x": "29vw",
        "--meteor-end-y": "16vh",
        "--meteor-angle": "24deg",
        "--meteor-duration": "79s",
        "--meteor-delay": "-6s",
    },
    {
        "--meteor-x": "-10vw",
        "--meteor-y": "36vh",
        "--meteor-mid-x": "24vw",
        "--meteor-mid-y": "10vh",
        "--meteor-end-x": "33vw",
        "--meteor-end-y": "14vh",
        "--meteor-angle": "18deg",
        "--meteor-duration": "86s",
        "--meteor-delay": "-41s",
    },
    {
        "--meteor-x": "-11vw",
        "--meteor-y": "62vh",
        "--meteor-mid-x": "21vw",
        "--meteor-mid-y": "9vh",
        "--meteor-end-x": "29vw",
        "--meteor-end-y": "13vh",
        "--meteor-angle": "16deg",
        "--meteor-duration": "93s",
        "--meteor-delay": "-57s",
    },
    {
        "--meteor-x": "44vw",
        "--meteor-y": "-12vh",
        "--meteor-mid-x": "-10vw",
        "--meteor-mid-y": "24vh",
        "--meteor-end-x": "-15vw",
        "--meteor-end-y": "34vh",
        "--meteor-angle": "-32deg",
        "--meteor-duration": "88s",
        "--meteor-delay": "-19s",
    },
    {
        "--meteor-x": "74vw",
        "--meteor-y": "-14vh",
        "--meteor-mid-x": "-13vw",
        "--meteor-mid-y": "25vh",
        "--meteor-end-x": "-20vw",
        "--meteor-end-y": "36vh",
        "--meteor-angle": "-30deg",
        "--meteor-duration": "97s",
        "--meteor-delay": "-63s",
    },
    {
        "--meteor-x": "20vw",
        "--meteor-y": "-10vh",
        "--meteor-mid-x": "9vw",
        "--meteor-mid-y": "22vh",
        "--meteor-end-x": "14vw",
        "--meteor-end-y": "31vh",
        "--meteor-angle": "28deg",
        "--meteor-duration": "84s",
        "--meteor-delay": "-48s",
    },
    {
        "--meteor-x": "58vw",
        "--meteor-y": "18vh",
        "--meteor-mid-x": "-12vw",
        "--meteor-mid-y": "14vh",
        "--meteor-end-x": "-18vw",
        "--meteor-end-y": "21vh",
        "--meteor-angle": "-26deg",
        "--meteor-duration": "76s",
        "--meteor-delay": "-27s",
    },
    {
        "--meteor-x": "86vw",
        "--meteor-y": "80vh",
        "--meteor-mid-x": "-20vw",
        "--meteor-mid-y": "6vh",
        "--meteor-end-x": "-28vw",
        "--meteor-end-y": "10vh",
        "--meteor-angle": "-12deg",
        "--meteor-duration": "102s",
        "--meteor-delay": "-75s",
    },
];

export default function EmeraldScene() {
    return (
        <div
            className="fixed inset-0 z-[-1] pointer-events-none bg-black relative overflow-hidden"
            style={{ opacity: 0.76 }}
            aria-hidden="true"
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

            <div className="starfield-overlay" />

            <div className="shooting-stars">
                {shootingStarStyles.map((style, index) => (
                    <span key={index} className="shooting-star" style={style} />
                ))}
            </div>
        </div>
    );
}
