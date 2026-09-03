import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DockingStation({ isDocked = false }) {
  const guideLightsRef = useRef([]);
  const steamPuffsRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Pulse runway approach guide lights sequentially
    guideLightsRef.current.forEach((light, i) => {
      if (light) {
        const pulse = Math.sin(time * 4 - i * 0.8) * 0.5 + 0.5;
        light.intensity = isDocked ? 0.3 : 0.8 + pulse * 1.2;
      }
    });

    // Gentle coolant steam venting when docked
    if (steamPuffsRef.current && isDocked) {
      steamPuffsRef.current.children.forEach((puff, idx) => {
        puff.position.y += 0.008;
        puff.scale.addScalar(0.004);
        if (puff.position.y > 1.4) {
          puff.position.y = 0.1;
          puff.scale.set(0.2, 0.2, 0.2);
        }
      });
    }
  });

  return (
    <group position={[0, 36.0, -158]}>
      {/* Heavy Hexagonal Reinforced Docking Platform Base */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.16, 6]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.6}
          metalness={0.5}
          flatShading
        />
      </mesh>

      {/* Inner Magnetic Docking Plate */}
      <mesh position={[0, 0.17, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.3, 0.05, 6]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.7}
          flatShading
        />
      </mesh>

      {/* Amber Alignment Docking Ring */}
      <mesh position={[0, 0.20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.85, 24]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={isDocked ? 0.9 : 0.4}
        />
      </mesh>

      {/* Central Magnetic Anchor Beacon */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 6]} />
        <meshBasicMaterial
          color={isDocked ? '#10b981' : '#f59e0b'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 4 Hydraulic Robotic Clamp Pylons framing the docking berth */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <group key={`pylon-${idx}`} rotation={[0, angle + Math.PI / 4, 0]}>
          <group position={[0, 0, 2.4]}>
            {/* Pylon Vertical Column */}
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.35, 1.1, 0.35]} />
              <meshStandardMaterial
                color="#334155"
                roughness={0.5}
                metalness={0.6}
                flatShading
              />
            </mesh>

            {/* Inward Incline Robotic Clamp Arm */}
            <mesh position={[0, 1.15, -0.3]} rotation={[0.45, 0, 0]} castShadow>
              <boxGeometry args={[0.22, 0.65, 0.22]} />
              <meshStandardMaterial
                color="#475569"
                roughness={0.4}
                metalness={0.7}
                flatShading
              />
            </mesh>

            {/* Magnetic Clamp Head Sensor */}
            <mesh position={[0, 1.38, -0.55]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial
                color={isDocked ? '#10b981' : '#38bdf8'}
              />
            </mesh>

            {/* Pylon Guide Beacon Light */}
            <pointLight
              ref={(el) => (guideLightsRef.current[idx] = el)}
              position={[0, 1.2, 0]}
              color="#f59e0b"
              distance={4}
              decay={2}
            />
          </group>
        </group>
      ))}

      {/* Coolant Steam Venting Emitters when Docked */}
      {isDocked && (
        <group ref={steamPuffsRef} position={[0, 0.2, 0]}>
          {[-0.8, 0.8].map((x, i) =>
            [-0.8, 0.8].map((z, j) => (
              <mesh
                key={`steam-${i}-${j}`}
                position={[x, 0.2, z]}
                scale={[0.3, 0.3, 0.3]}
              >
                <sphereGeometry args={[0.2, 6, 6]} />
                <meshBasicMaterial
                  color="#e2e8f0"
                  transparent
                  opacity={0.35}
                />
              </mesh>
            ))
          )}
        </group>
      )}
    </group>
  );
}
