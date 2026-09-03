import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ThrusterParticles from './ThrusterParticles';

export default function Rocket({
  position = [0, 0, 0],
  quaternion = new THREE.Quaternion(),
  flightState = 'IDLE',
  touchdownTrigger = 0,
  isTransmissionTyping = false,
  isDocked = false,
  isMobile = false,
}) {
  const rocketGroupRef = useRef();
  const fuselageRef = useRef();
  const landingBounceRef = useRef(0);
  const portholeMaterialRef = useRef();
  const portholeLightRef = useRef();

  // Trigger suspension compression bounce on touchdown
  useEffect(() => {
    if (touchdownTrigger > 0) {
      landingBounceRef.current = 1.0;
    }
  }, [touchdownTrigger]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const isLanded = flightState === 'IDLE' || flightState === 'TOUCHDOWN';

    if (rocketGroupRef.current) {
      // Direct position assignment
      rocketGroupRef.current.position.set(position[0], position[1], position[2]);

      // Direct quaternion assignment from flight controller
      rocketGroupRef.current.quaternion.copy(quaternion);

      // Idle breathing and landing suspension bounce
      if (isLanded) {
        if (landingBounceRef.current > 0) {
          landingBounceRef.current = Math.max(0, landingBounceRef.current - delta * 3.5);
          // Spring bounce: rapid compression and settle
          const bounce = Math.sin(landingBounceRef.current * Math.PI * 4) * 0.12 * landingBounceRef.current;
          rocketGroupRef.current.position.y += bounce;
        } else if (!isDocked) {
          // Gentle idle bobbing when resting on standard planets (powered down completely when docked)
          rocketGroupRef.current.position.y += Math.sin(time * 2.0) * 0.035;
        }
      }
    }

    // --- Cockpit Interior Light Pulsing in Sync with Transmission ---
    if (portholeLightRef.current) {
      if (isTransmissionTyping) {
        // High-frequency data transmission flicker in sync with terminal typing
        const typingFlicker = 1.2 + Math.sin(time * 36) * 0.5 + (Math.random() - 0.5) * 0.35;
        portholeLightRef.current.intensity = typingFlicker * 1.8;
      } else {
        // Calm steady interior cabin illumination
        const idlePulse = 0.9 + Math.sin(time * 2.2) * 0.2;
        portholeLightRef.current.intensity = THREE.MathUtils.damp(
          portholeLightRef.current.intensity,
          idlePulse,
          4.0,
          delta
        );
      }
    }
  });

  // Materials matching reference video
  const whiteHullMat = (
    <meshStandardMaterial
      color="#f1f5f9"
      roughness={0.4}
      metalness={0.1}
      flatShading
    />
  );

  const rustRedMat = (
    <meshStandardMaterial
      color="#c84b31"
      roughness={0.5}
      metalness={0.15}
      flatShading
    />
  );

  const darkEngineMat = (
    <meshStandardMaterial
      color="#1e293b"
      roughness={0.7}
      metalness={0.4}
      flatShading
    />
  );

  const portholeRingMat = (
    <meshStandardMaterial
      color="#475569"
      roughness={0.35}
      metalness={0.65}
      flatShading
    />
  );

  const portholeGlassMat = (
    <meshStandardMaterial
      color="#0284c7"
      roughness={0.2}
      metalness={0.8}
      flatShading
    />
  );

  return (
    <group
      ref={rocketGroupRef}
      position={position}
      scale={[0.78, 0.78, 0.78]}
    >
      {/* Central Rocket Assembly (elevated so footpads touch y = 0) */}
      <group ref={fuselageRef} position={[0, 0.7, 0]}>
        
        {/* --- FUSELAGE --- */}
        {/* Main Body (8-sided faceted cylinder) */}
        <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.95, 2.0, 8]} />
          {whiteHullMat}
        </mesh>

        {/* Upper Tapered Fuselage */}
        <mesh position={[0, 3.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.48, 0.78, 0.9, 8]} />
          {whiteHullMat}
        </mesh>

        {/* Rust-Red Nosecone Tip */}
        <mesh position={[0, 4.65, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.48, 0.9, 8]} />
          {rustRedMat}
        </mesh>

        {/* Lower Body Section */}
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.95, 0.68, 0.5, 8]} />
          {whiteHullMat}
        </mesh>

        {/* Engine Bell / Nozzle (Gunmetal grey) */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.65, 0.42, 8]} />
          {darkEngineMat}
        </mesh>

        {/* Engine Interior Glow Disc */}
        <mesh position={[0, 0.42, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.05, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* --- LARGE ROUND PORTHOLE WINDOW WITH WAVING ASTRONAUT (MATCHING REFERENCE) --- */}
        <group position={[0, 2.70, 0.80]}>
          {/* Dark Interior Cabin Alcove Backing (Deep space cockpit shadow) */}
          <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.43, 0.43, 0.04, 28]} />
            <meshStandardMaterial
              color="#030712"
              roughness={0.9}
              flatShading
            />
          </mesh>

          {/* Prominent Metallic/Grey Outer Beveled Rim / Frame */}
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.48, 0.53, 0.12, 28]} />
            {portholeRingMat}
          </mesh>

          {/* Inner Metallic Lip / Retaining Collar */}
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.46, 0.13, 28]} />
            <meshStandardMaterial
              color="#64748b"
              roughness={0.4}
              metalness={0.6}
              flatShading
            />
          </mesh>

          {/* 10 Perimeter Metallic Rivet Hardware Screws */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const angle = (i / 10) * Math.PI * 2;
            return (
              <mesh
                key={`porthole-rivet-${i}`}
                position={[Math.cos(angle) * 0.47, Math.sin(angle) * 0.47, 0.10]}
              >
                <sphereGeometry args={[0.022, 6, 6]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  roughness={0.25}
                  metalness={0.8}
                />
              </mesh>
            );
          })}

          {/* Interior Cockpit Cabin Ambient Point Light */}
          <pointLight
            ref={portholeLightRef}
            position={[0, 0.05, 0.04]}
            color="#bae6fd"
            intensity={0.9}
            distance={2.5}
            decay={2}
          />

          {/* Transparent Blue-Tinted Glass Pane (Clear see-through glass, depthWrite: false) */}
          <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.41, 0.41, 0.01, 28]} />
            <meshStandardMaterial
              ref={portholeMaterialRef}
              color="#7dd3fc"
              transparent={true}
              opacity={0.18}
              roughness={0.05}
              metalness={0.0}
              depthWrite={false}
            />
          </mesh>

          {/* Soft Curved Highlight Streak on Glass (Matching reference curvature) */}
          <mesh position={[-0.08, 0.22, 0.095]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.34, 0.035, 0.002]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.32}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-0.22, 0.12, 0.095]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[0.12, 0.03, 0.002]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* --- 4 LANDING LEGS / FINS --- */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, index) => (
          <group key={index} rotation={[0, angle, 0]}>
            {/* Aerodynamic Fin Blade (Upper wing) */}
            <mesh position={[0, 1.45, 0.95]} rotation={[0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 1.2, 0.55]} />
              {rustRedMat}
            </mesh>

            {/* Swept-Back Main Leg Strut */}
            <mesh position={[0, 0.7, 1.25]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 1.5, 0.35]} />
              {rustRedMat}
            </mesh>

            {/* Vertical Lower Landing Strut */}
            <mesh position={[0, -0.2, 1.38]} castShadow>
              <boxGeometry args={[0.12, 0.8, 0.16]} />
              {rustRedMat}
            </mesh>

            {/* Foot Pad touching ground */}
            <mesh position={[0, -0.65, 1.38]} receiveShadow castShadow>
              <boxGeometry args={[0.28, 0.1, 0.32]} />
              {rustRedMat}
            </mesh>
          </group>
        ))}
      </group>

      {/* Thruster Flame, Sparks, and Ground Dust with dynamic flight modes */}
      <ThrusterParticles
        position={[0, 0.05, 0]}
        flightState={flightState}
        touchdownTrigger={touchdownTrigger}
        isDocked={isDocked}
        isMobile={isMobile}
      />
    </group>
  );
}
