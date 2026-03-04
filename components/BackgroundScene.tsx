"use client";

import dynamic from "next/dynamic";

const EmeraldSceneNoSSR = dynamic(() => import("@/components/EmeraldScene"), {
    ssr: false,
});

export default function BackgroundScene() {
    return <EmeraldSceneNoSSR />;
}
