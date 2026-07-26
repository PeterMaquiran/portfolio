"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

import StudioLightsPhone from "../three/StudioLightsPhone";
import IPhone from "../models/IPhone";

/* -------------------------------------------
   Spinning Wrapper (Corrected Orientation)
-------------------------------------------*/
function SpinningIPhone({
  screenSource,
  scale,
  position,
  spin,
  spinDuration,
}: {
  screenSource: string;
  scale: number;
  position: [number, number, number];
  spin: boolean;
  spinDuration: number;
}) {
  const spinRef = useRef<any>(null);
  const startTime = useRef<number | null>(null);
  const finished = useRef(false);

  /**
   * MATH EXPLAINED:
   * START = 0 (This will now be the BACK because of the inner group flip)
   * END = Math.PI (This will now be the FRONT because of the inner group flip)
   */
  const START = 0; 
  const END = Math.PI;        

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  useFrame(({ clock }) => {
    if (!spin || !spinRef.current || finished.current) return;

    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime() * 1000;
    }

    const now = clock.getElapsedTime() * 1000;
    const elapsed = now - startTime.current;

    const t = Math.min(elapsed / spinDuration, 1);
    const eased = easeOut(t);

    // This handles the animation spin
    spinRef.current.rotation.y = START + (END - START) * eased;

    if (t >= 1) {
      finished.current = true;
      spinRef.current.rotation.y = END;
    }
  });

  return (
    <group ref={spinRef} rotation={[0, spin ? START : END, 0]}>
      {/* THIS IS THE KEY: 
          If your model shows the back at 0, we flip it 180 deg (Math.PI) 
          internally so that the "END" of our animation shows the screen.
      */}
      <group rotation={[0, Math.PI, 0]}>
        <IPhone
          screenSource={screenSource}
          scale={scale}
          position={position}
          item={{
            color: ["#111111"],
          }}
        />
      </group>
    </group>
  );
}

/* ------------------------------
   Main Monitor Component
--------------------------------*/
export default function Monitor({
  canvasHeight = "100vh",
  canvasWidth = "100vw",
  screenSource = "/screen.png",
  cameraStepBack = 0.08,
  spin = true,
  spinDuration = 3000,
}: {
  canvasHeight?: string;
  canvasWidth?: string;
  screenSource?: string;
  cameraStepBack?: number;
  spin?: boolean;
  spinDuration?: number;
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
  }, []);

  const allowSpin = true || !isMobile || isIOS;

  const controlsConfig = {
    snap: true,
    speed: 1,
    zoom: 1,
    azimuth: [-Infinity, Infinity] as [number, number],
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  };

  return (
    <div
      style={{
        height: canvasHeight,
        width: canvasWidth,
        cursor: "grab",
      }}
      className="overflow-hidden"
    >
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <StudioLightsPhone />

        <PresentationControls {...controlsConfig}>
          <SpinningIPhone
            screenSource={screenSource}
            scale={cameraStepBack}
            position={[0, 0, 0]}
            spin={spin && allowSpin}
            spinDuration={spinDuration}
          />
        </PresentationControls>
      </Canvas>
    </div>
  );
}