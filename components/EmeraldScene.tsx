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
        "--meteor-y": "6vh",
        "--meteor-mid-x": "-28vw",
        "--meteor-mid-y": "14vh",
        "--meteor-end-x": "-40vw",
        "--meteor-end-y": "23vh",
        "--meteor-angle": "-22deg",
        "--meteor-duration": "34s",
        "--meteor-delay": "-4s",
    },
    {
        "--meteor-x": "105vw",
        "--meteor-y": "22vh",
        "--meteor-mid-x": "-25vw",
        "--meteor-mid-y": "11vh",
        "--meteor-end-x": "-34vw",
        "--meteor-end-y": "17vh",
        "--meteor-angle": "-18deg",
        "--meteor-duration": "42s",
        "--meteor-delay": "-12s",
    },
    {
        "--meteor-x": "106vw",
        "--meteor-y": "40vh",
        "--meteor-mid-x": "-27vw",
        "--meteor-mid-y": "9vh",
        "--meteor-end-x": "-36vw",
        "--meteor-end-y": "14vh",
        "--meteor-angle": "-14deg",
        "--meteor-duration": "39s",
        "--meteor-delay": "-19s",
    },
    {
        "--meteor-x": "107vw",
        "--meteor-y": "58vh",
        "--meteor-mid-x": "-22vw",
        "--meteor-mid-y": "8vh",
        "--meteor-end-x": "-31vw",
        "--meteor-end-y": "13vh",
        "--meteor-angle": "-15deg",
        "--meteor-duration": "47s",
        "--meteor-delay": "-30s",
    },
    {
        "--meteor-x": "110vw",
        "--meteor-y": "76vh",
        "--meteor-mid-x": "-24vw",
        "--meteor-mid-y": "8vh",
        "--meteor-end-x": "-33vw",
        "--meteor-end-y": "14vh",
        "--meteor-angle": "-12deg",
        "--meteor-duration": "44s",
        "--meteor-delay": "-9s",
    },
    {
        "--meteor-x": "112vw",
        "--meteor-y": "90vh",
        "--meteor-mid-x": "-18vw",
        "--meteor-mid-y": "6vh",
        "--meteor-end-x": "-27vw",
        "--meteor-end-y": "10vh",
        "--meteor-angle": "-10deg",
        "--meteor-duration": "52s",
        "--meteor-delay": "-21s",
    },
    {
        "--meteor-x": "-12vw",
        "--meteor-y": "14vh",
        "--meteor-mid-x": "24vw",
        "--meteor-mid-y": "12vh",
        "--meteor-end-x": "34vw",
        "--meteor-end-y": "18vh",
        "--meteor-angle": "22deg",
        "--meteor-duration": "36s",
        "--meteor-delay": "-7s",
    },
    {
        "--meteor-x": "-11vw",
        "--meteor-y": "30vh",
        "--meteor-mid-x": "22vw",
        "--meteor-mid-y": "10vh",
        "--meteor-end-x": "31vw",
        "--meteor-end-y": "16vh",
        "--meteor-angle": "18deg",
        "--meteor-duration": "41s",
        "--meteor-delay": "-16s",
    },
    {
        "--meteor-x": "-10vw",
        "--meteor-y": "48vh",
        "--meteor-mid-x": "23vw",
        "--meteor-mid-y": "9vh",
        "--meteor-end-x": "32vw",
        "--meteor-end-y": "14vh",
        "--meteor-angle": "14deg",
        "--meteor-duration": "46s",
        "--meteor-delay": "-26s",
    },
    {
        "--meteor-x": "-10vw",
        "--meteor-y": "66vh",
        "--meteor-mid-x": "25vw",
        "--meteor-mid-y": "8vh",
        "--meteor-end-x": "35vw",
        "--meteor-end-y": "13vh",
        "--meteor-angle": "13deg",
        "--meteor-duration": "49s",
        "--meteor-delay": "-33s",
    },
    {
        "--meteor-x": "-9vw",
        "--meteor-y": "84vh",
        "--meteor-mid-x": "21vw",
        "--meteor-mid-y": "7vh",
        "--meteor-end-x": "29vw",
        "--meteor-end-y": "11vh",
        "--meteor-angle": "11deg",
        "--meteor-duration": "55s",
        "--meteor-delay": "-38s",
    },
    {
        "--meteor-x": "22vw",
        "--meteor-y": "-12vh",
        "--meteor-mid-x": "12vw",
        "--meteor-mid-y": "26vh",
        "--meteor-end-x": "18vw",
        "--meteor-end-y": "38vh",
        "--meteor-angle": "26deg",
        "--meteor-duration": "40s",
        "--meteor-delay": "-14s",
    },
    {
        "--meteor-x": "52vw",
        "--meteor-y": "-14vh",
        "--meteor-mid-x": "-12vw",
        "--meteor-mid-y": "28vh",
        "--meteor-end-x": "-18vw",
        "--meteor-end-y": "40vh",
        "--meteor-angle": "-30deg",
        "--meteor-duration": "43s",
        "--meteor-delay": "-22s",
    },
    {
        "--meteor-x": "76vw",
        "--meteor-y": "-12vh",
        "--meteor-mid-x": "-13vw",
        "--meteor-mid-y": "25vh",
        "--meteor-end-x": "-19vw",
        "--meteor-end-y": "37vh",
        "--meteor-angle": "-28deg",
        "--meteor-duration": "37s",
        "--meteor-delay": "-29s",
    },
    {
        "--meteor-x": "90vw",
        "--meteor-y": "34vh",
        "--meteor-mid-x": "-20vw",
        "--meteor-mid-y": "12vh",
        "--meteor-end-x": "-29vw",
        "--meteor-end-y": "18vh",
        "--meteor-angle": "-19deg",
        "--meteor-duration": "45s",
        "--meteor-delay": "-35s",
    },
    {
        "--meteor-x": "10vw",
        "--meteor-y": "52vh",
        "--meteor-mid-x": "18vw",
        "--meteor-mid-y": "11vh",
        "--meteor-end-x": "26vw",
        "--meteor-end-y": "17vh",
        "--meteor-angle": "17deg",
        "--meteor-duration": "51s",
        "--meteor-delay": "-42s",
    },
];

export default function EmeraldScene() {
    return (
        <div
            className="fixed inset-0 z-[-1] pointer-events-none bg-black relative overflow-hidden"
            style={{ opacity: 0.84 }}
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
