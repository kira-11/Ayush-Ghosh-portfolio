import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural 3D Extruded 5-pointed star geometry
function createStarGeometry() {
  const shape = new THREE.Shape();
  const outerR = 0.45;
  const innerR = 0.2;
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 1,
  });
}

export default function SpaceEnvironment({ isMobile = false }) {
  const starfieldGroupRef = useRef();
  const lowPolyStarsRef = useRef([]);
  const asteroidsRef = useRef([]);

  // Star geometry instance
  const starGeo = useMemo(() => createStarGeometry(), []);

  // 3D Extruded 5-pointed stars distributed along the full corridor (Z: 10 down to -180)
  const extrudedStars = useMemo(() => {
    const list = [];
    const zSegments = [0, -35, -75, -115, -155, -180];
    
    zSegments.forEach((zBase, segmentIdx) => {
      // 5-6 stars per planetary sector
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + segmentIdx;
        const radius = 12 + Math.random() * 16;
        const yOffset = (segmentIdx * 7) + 5 + Math.random() * 14;
        list.push({
          pos: [
            Math.cos(angle) * radius + (segmentIdx % 2 === 0 ? 6 : -6),
            yOffset,
            zBase + (Math.random() - 0.5) * 25,
          ],
          scale: 0.7 + Math.random() * 0.7,
          rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          rotSpeed: (Math.random() - 0.5) * 0.3,
        });
      }
    });

    return list;
  }, []);

  // Floating low-poly celestial spheres/polyhedra (Pastel colors from reference)
  const celestialBodies = useMemo(() => {
    const colors = ['#fca5a5', '#cbd5e1', '#99f6e4', '#bae6fd', '#fbcfe8', '#fed7aa'];
    const list = [];
    const zSegments = [0, -38, -78, -118, -158];

    zSegments.forEach((zBase, idx) => {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + idx * 1.2;
        const dist = 14 + Math.random() * 12;
        list.push({
          pos: [
            Math.cos(angle) * dist,
            (idx * 7) + 6 + (Math.random() - 0.5) * 10,
            zBase + (Math.random() - 0.5) * 20,
          ],
          scale: 0.5 + Math.random() * 0.65,
          color: colors[(idx * 4 + i) % colors.length],
          rotSpeed: (Math.random() - 0.5) * 0.35,
        });
      }
    });

    return list;
  }, []);

  // Dense distant twinkling background star points surrounding the corridor
  const { starPointsGeometry } = useMemo(() => {
    const count = isMobile ? 500 : 1200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 55;
      const z = 25 - Math.random() * 230; // Spans Z from 25 to -205
      const y = -10 + Math.random() * 70;

      positions[i * 3 + 0] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { starPointsGeometry: geo };
  }, [isMobile]);

  // Ambient parallax drift
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (starfieldGroupRef.current) {
      starfieldGroupRef.current.rotation.y = Math.sin(time * 0.03) * 0.015;
    }

    // Animate extruded stars
    lowPolyStarsRef.current.forEach((mesh, i) => {
      if (mesh) {
        const item = extrudedStars[i];
        mesh.rotation.z += item.rotSpeed * delta;
        mesh.rotation.y += item.rotSpeed * 0.5 * delta;
        mesh.position.y = item.pos[1] + Math.sin(time * 0.8 + i) * 0.12;
      }
    });

    // Animate celestial polyhedra
    asteroidsRef.current.forEach((mesh, i) => {
      if (mesh) {
        const item = celestialBodies[i];
        mesh.rotation.x += item.rotSpeed * delta;
        mesh.rotation.y += item.rotSpeed * 0.7 * delta;
        mesh.position.y = item.pos[1] + Math.sin(time * 0.6 + i) * 0.15;
      }
    });
  });

  return (
    <group ref={starfieldGroupRef}>
      {/* 3D Extruded Low-Poly 5-Pointed Stars */}
      {extrudedStars.map((item, idx) => (
        <mesh
          key={`star-${idx}`}
          ref={(el) => (lowPolyStarsRef.current[idx] = el)}
          geometry={starGeo}
          position={item.pos}
          rotation={item.rot}
          scale={item.scale}
        >
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fde68a"
            emissiveIntensity={0.25}
            roughness={0.5}
            metalness={0.1}
            flatShading
          />
        </mesh>
      ))}

      {/* Floating Low-Poly Celestial Polyhedra */}
      {celestialBodies.map((item, idx) => (
        <mesh
          key={`asteroid-${idx}`}
          ref={(el) => (asteroidsRef.current[idx] = el)}
          position={item.pos}
          scale={item.scale}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={item.color}
            roughness={0.65}
            metalness={0.15}
            flatShading
          />
        </mesh>
      ))}

      {/* Deep Space Star Points */}
      <points geometry={starPointsGeometry}>
        <pointsMaterial
          size={0.16}
          color="#e2e8f0"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
