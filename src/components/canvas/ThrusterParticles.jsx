import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ThrusterParticles({
  position = [0, 0, 0],
  flightState = 'IDLE',
  touchdownTrigger = 0,
  isDocked = false,
  isMobile = false,
}) {
  const sparkCount = isMobile ? 35 : 90;
  const sparkPointsRef = useRef();
  const flameConeRef = useRef();
  const flameOuterRef = useRef();
  const dustGroupRef = useRef();
  const shockwaveRef = useRef();
  const touchdownAnimRef = useRef(0);

  // Trigger burst when touchdownTrigger updates
  useEffect(() => {
    if (touchdownTrigger > 0) {
      touchdownAnimRef.current = 1.0; // 1.0 to 0.0 decay
    }
  }, [touchdownTrigger]);

  // Spark physics buffers
  const { positions, velocities, lifetimes, maxLifetimes, sparkGeometry } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const vel = [];
    const life = new Float32Array(sparkCount);
    const maxLife = new Float32Array(sparkCount);

    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3 + 0] = 0;
      pos[i * 3 + 1] = 0.5;
      pos[i * 3 + 2] = 0;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.5;
      vel.push({
        vx: Math.cos(angle) * speed,
        vy: -0.8 - Math.random() * 0.8,
        vz: Math.sin(angle) * speed,
      });

      life[i] = Math.random();
      maxLife[i] = 0.5 + Math.random() * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    return {
      positions: pos,
      velocities: vel,
      lifetimes: life,
      maxLifetimes: maxLife,
      sparkGeometry: geo,
    };
  }, [sparkCount]);

  // Low-poly dust puffs around touchdown pad
  const dustPuffs = useMemo(() => {
    const list = [];
    const count = isMobile ? 4 : 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.8 + Math.random() * 0.4;
      list.push({
        initialX: Math.cos(angle) * r,
        initialZ: Math.sin(angle) * r,
        offset: Math.random() * Math.PI * 2,
        scale: 0.35 + Math.random() * 0.25,
        rotSpeed: (Math.random() - 0.5) * 1.2,
      });
    }
    return list;
  }, [isMobile]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const isLanded = flightState === 'IDLE' || flightState === 'TOUCHDOWN';
    const isCruise = flightState === 'CRUISE';
    const isLiftoff = flightState === 'LIFTOFF';
    const isDescent = flightState === 'DESCENT';

    // Touchdown decay
    if (touchdownAnimRef.current > 0) {
      touchdownAnimRef.current = Math.max(0, touchdownAnimRef.current - delta * 1.8);
    }
    const burst = touchdownAnimRef.current;

    // --- Dynamic Flame Scales ---
    let baseScaleY = 1.0;
    let baseScaleXZ = 1.0;

    if (isDocked) {
      // Engines powered down in docking bay
      baseScaleY = 0;
      baseScaleXZ = 0;
    } else if (isLiftoff) {
      baseScaleY = 2.4;
    } else if (isLiftoff || isDescent) {
      baseScaleY = 1.8;
      baseScaleXZ = 1.35;
    } else if (isLanded) {
      baseScaleY = 0.9 + burst * 1.4;
      baseScaleXZ = 0.9 + burst * 1.6;
    }

    const flameFlicker = 1.0 + Math.sin(time * 30) * 0.12 + (Math.random() - 0.5) * 0.08;

    if (flameConeRef.current) {
      flameConeRef.current.scale.set(
        baseScaleXZ * flameFlicker,
        baseScaleY * flameFlicker,
        baseScaleXZ * flameFlicker
      );
    }
    if (flameOuterRef.current) {
      flameOuterRef.current.scale.set(
        baseScaleXZ * 1.2 * flameFlicker,
        baseScaleY * 1.15 * flameFlicker,
        baseScaleXZ * 1.2 * flameFlicker
      );
    }

    // --- Spark Particles Simulation ---
    if (sparkPointsRef.current) {
      const posAttr = sparkPointsRef.current.geometry.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < sparkCount; i++) {
        lifetimes[i] += delta;

        if (lifetimes[i] >= maxLifetimes[i] || posArray[i * 3 + 1] <= -0.1) {
          lifetimes[i] = 0;
          posArray[i * 3 + 0] = (Math.random() - 0.5) * 0.2;
          posArray[i * 3 + 1] = 0.5;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

          // Velocity calculation based on state
          const angle = Math.random() * Math.PI * 2;
          let speed = 0.8 + Math.random() * 1.4;
          let vy = -0.6 - Math.random() * 0.8;

          if (burst > 0.05) {
            // Explosive radial touchdown blast
            speed = 2.8 + Math.random() * 3.5;
            vy = 0.1 + Math.random() * 0.5;
          } else if (isCruise) {
            // Trailing trail behind rocket
            speed = 0.3 + Math.random() * 0.6;
            vy = -2.8 - Math.random() * 1.2;
          } else if (isLiftoff) {
            speed = 1.8 + Math.random() * 2.2;
            vy = -1.5 - Math.random() * 1.0;
          }

          velocities[i].vx = Math.cos(angle) * speed;
          velocities[i].vy = vy;
          velocities[i].vz = Math.sin(angle) * speed;
        } else {
          posArray[i * 3 + 0] += velocities[i].vx * delta;
          posArray[i * 3 + 1] += velocities[i].vy * delta;
          posArray[i * 3 + 2] += velocities[i].vz * delta;

          // If landed or liftoff, bounce sparks outward horizontally on ground
          if (isLanded && posArray[i * 3 + 1] < 0.08) {
            velocities[i].vy = Math.abs(velocities[i].vy) * 0.15;
            velocities[i].vx *= 1.08;
            velocities[i].vz *= 1.08;
          }
        }
      }
      posAttr.needsUpdate = true;
    }

    // --- Ground Dust Puffs ---
    if (dustGroupRef.current) {
      const showDust = !isCruise && !isDocked;
      dustGroupRef.current.visible = showDust;

      if (showDust) {
        dustGroupRef.current.children.forEach((child, idx) => {
          const meta = dustPuffs[idx];
          const pulse = (Math.sin(time * 2.5 + meta.offset) + 1) * 0.5;
          const burstBoost = burst * 1.8;
          child.position.y = 0.08 + (pulse + burstBoost) * 0.25;
          child.position.x = meta.initialX * (1 + burstBoost * 1.5);
          child.position.z = meta.initialZ * (1 + burstBoost * 1.5);
          child.rotation.y += meta.rotSpeed * delta;
          const currentScale = meta.scale * (0.8 + pulse * 0.4 + burstBoost * 1.2);
          child.scale.set(currentScale, currentScale, currentScale);
        });
      }
    }

    // --- Expanding Shockwave Ring on Touchdown ---
    if (shockwaveRef.current) {
      if (burst > 0.01) {
        shockwaveRef.current.visible = true;
        const ringScale = (1.0 - burst) * 4.2 + 0.5;
        shockwaveRef.current.scale.set(ringScale, ringScale, 1);
        shockwaveRef.current.material.opacity = burst * 0.75;
      } else {
        shockwaveRef.current.visible = false;
      }
    }
  });

  return (
    <group position={position}>
      {/* Inner Cyan Jet Core */}
      <mesh ref={flameConeRef} position={[0, 0.45, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.22, 0.7, 8]} />
        <meshBasicMaterial
          color="#a5f3fc"
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Cyan Thruster Flame Aura */}
      <mesh ref={flameOuterRef} position={[0, 0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.38, 0.85, 8]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.48}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Radiating Spark Embers */}
      <points ref={sparkPointsRef} geometry={sparkGeometry} visible={!isDocked}>
        <pointsMaterial
          size={0.08}
          color="#67e8f9"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ground Dust Puffs */}
      <group ref={dustGroupRef}>
        {dustPuffs.map((puff, i) => (
          <mesh
            key={i}
            position={[puff.initialX, 0.08, puff.initialZ]}
            rotation={[puff.offset, puff.offset * 2, 0]}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.4}
              roughness={0.9}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* Touchdown Shockwave Ring */}
      <mesh
        ref={shockwaveRef}
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.6, 0.95, 24]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
