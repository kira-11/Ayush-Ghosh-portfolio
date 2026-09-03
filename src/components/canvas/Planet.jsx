import React, { useMemo } from 'react';
import * as THREE from 'three';

// Low-poly crater with faceted raised outer rim, inner rim, and recessed floor
export function Crater({ position, radius = 1.4, height = 0.35, segments = 10, rotationY = 0, color = "#cfd7e1", innerColor = "#94a3b8" }) {
  const outerRadius = radius * 1.35;
  const innerRadius = radius * 0.75;
  const rimRadius = radius;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Raised Outer Slope */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[rimRadius, outerRadius, height, segments, 1, true]}
        />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.05}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sloping Inner Wall */}
      <mesh position={[0, height / 2 - 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[innerRadius, rimRadius, height + 0.1, segments, 1, true]}
        />
        <meshStandardMaterial
          color={innerColor}
          roughness={0.95}
          metalness={0.05}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Recessed Crater Basin/Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[innerRadius, segments]} />
        <meshStandardMaterial
          color={innerColor}
          roughness={0.95}
          metalness={0.05}
          flatShading
        />
      </mesh>
    </group>
  );
}

// Low-poly rock / asteroid fragment
export function MoonRock({ position, scale = 0.2, rotation = [0, 0, 0], color = "#b6c2cf" }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.88}
        metalness={0.08}
        flatShading
      />
    </mesh>
  );
}

// Low-poly landing pad with subtle runway markers
function LandingPad({ position, accentColor = "#22d3ee" }) {
  return (
    <group position={position}>
      {/* Landing circular boundary plate */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.55, 1.75, 16]} />
        <meshStandardMaterial
          color="#475569"
          roughness={0.6}
          metalness={0.3}
          flatShading
        />
      </mesh>

      {/* 4 Corner Touchdown Guide Beacons */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.04, 1.65]}>
            <boxGeometry args={[0.2, 0.06, 0.08]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Planet({ data }) {
  const { center, landingPad, color, accentColor, craters = [], rocks = [], radius = 13 } = data;

  // Generate low-poly terrain grid with natural height variations
  const { terrainGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(radius * 3.2, radius * 3.2, 36, 36);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const dist = Math.sqrt(x * x + y * y);
      const curvature = -Math.pow(dist / (radius * 1.5), 2) * 2.5;

      const noise =
        Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.28 +
        Math.sin(x * 0.7 + 1.2) * Math.cos(y * 0.6) * 0.14;

      // Flatten landing pad vicinity
      const flattenFactor = THREE.MathUtils.smoothstep(dist, 1.8, 4.5);
      const elevation = curvature + noise * flattenFactor;

      pos.setZ(i, elevation);
    }

    geo.computeVertexNormals();
    return { terrainGeometry: geo };
  }, [radius]);

  return (
    <group position={center}>
      {/* Planetary terrain mesh */}
      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 1.0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.92}
          metalness={0.06}
          flatShading
        />
      </mesh>

      {/* Craters relative to planet center */}
      {craters.map((c, i) => (
        <Crater
          key={i}
          position={[c.pos[0] - center[0], c.pos[1] - center[1], c.pos[2] - center[2]]}
          radius={c.radius}
          height={c.height}
          segments={c.segments}
          rotationY={c.rotY}
          color={color}
          innerColor={accentColor}
        />
      ))}

      {/* Surface Rocks */}
      {rocks.map((r, i) => (
        <MoonRock
          key={i}
          position={[r.pos[0] - center[0], r.pos[1] - center[1], r.pos[2] - center[2]]}
          scale={r.scale}
          rotation={[0.3, i * 0.8, 0.2]}
          color={color}
        />
      ))}

      {/* Landing Pad */}
      <LandingPad
        position={[landingPad[0] - center[0], landingPad[1] - center[1], landingPad[2] - center[2]]}
        accentColor="#22d3ee"
      />
    </group>
  );
}
