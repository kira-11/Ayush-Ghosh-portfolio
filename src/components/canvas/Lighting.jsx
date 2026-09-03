import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting({
  rocketPosition = [0, 0, 0],
  flightState = 'IDLE',
  isMobile = false,
}) {
  const engineLightRef = useRef();

  useFrame((state) => {
    if (engineLightRef.current) {
      const time = state.clock.elapsedTime;
      const isCruise = flightState === 'CRUISE';
      const isLiftoff = flightState === 'LIFTOFF';
      const isTouchdown = flightState === 'TOUCHDOWN';

      let baseIntensity = 3.2;
      if (isCruise) baseIntensity = 4.2;
      else if (isLiftoff) baseIntensity = 5.0;
      else if (isTouchdown) baseIntensity = 6.0;

      const flicker = Math.sin(time * 24) * 0.4 + (Math.random() - 0.5) * 0.25;
      engineLightRef.current.intensity = baseIntensity + flicker;

      // Follow rocket nozzle position
      engineLightRef.current.position.set(
        rocketPosition[0],
        rocketPosition[1] + 0.4,
        rocketPosition[2]
      );
    }
  });

  return (
    <>
      {/* Deep space ambient fill */}
      <ambientLight intensity={isMobile ? 0.62 : 0.48} color="#1e293b" />

      {/* Hemisphere light: deep blue space sky down to cool terrain */}
      <hemisphereLight
        skyColor="#243452"
        groundColor="#0f172a"
        intensity={isMobile ? 0.65 : 0.55}
      />

      {/* Key Directional Sunlight spanning the corridor - full 2K shadows on desktop, bypassed on mobile */}
      <directionalLight
        position={[25, 45, 20]}
        intensity={1.9}
        color="#ffe8d6"
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
        shadow-camera-near={0.5}
        shadow-camera-far={250}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
      />

      {/* Rim light from opposing side */}
      <directionalLight
        position={[-25, 30, -100]}
        intensity={0.65}
        color="#7dd3fc"
      />

      {/* Dynamic Cyan Engine Point Light following the rocket */}
      <pointLight
        ref={engineLightRef}
        color="#22d3ee"
        intensity={3.5}
        distance={12}
        decay={2}
      />
    </>
  );
}
