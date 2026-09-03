import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Classic 5-Point Star Polygon Geometry
function createFivePointStarGeometry() {
  const shape = new THREE.Shape();
  const outerR = 0.28;
  const innerR = 0.12;
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
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 1,
  });
}

export { SKILL_CLUSTERS } from '../../data/portfolioContent';
import { SKILL_CLUSTERS } from '../../data/portfolioContent';

export default function SkillsConstellation({
  hoveredNodeId,
  onHoverNode,
  activeClusterId,
}) {
  const constellationGroupRef = useRef();
  const starGeo = useMemo(() => createFivePointStarGeometry(), []);

  // Compute inter-connecting lines for each cluster
  const clusterLines = useMemo(() => {
    return SKILL_CLUSTERS.map((cluster) => {
      const pts = [];
      const nodes = cluster.nodes;

      // Connect each node to its nearest neighbor nodes in the cluster
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          pts.push(new THREE.Vector3(...nodes[i].pos));
          pts.push(new THREE.Vector3(...nodes[j].pos));
        }
      }

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      return {
        clusterId: cluster.id,
        color: cluster.color,
        geometry: geo,
      };
    });
  }, []);

  // Subtle floating celestial breathing motion
  useFrame((state) => {
    if (constellationGroupRef.current) {
      const time = state.clock.elapsedTime;
      constellationGroupRef.current.position.y = Math.sin(time * 0.7) * 0.12;
    }
  });

  return (
    <group ref={constellationGroupRef}>
      {/* Cluster Constellation Connecting Lines */}
      {clusterLines.map((lineData) => {
        const isClusterActive =
          !activeClusterId || activeClusterId === lineData.clusterId;
        return (
          <lineSegments key={`lines-${lineData.clusterId}`} geometry={lineData.geometry}>
            <lineBasicMaterial
              color={lineData.color}
              transparent
              opacity={isClusterActive ? 0.35 : 0.07}
              linewidth={1}
            />
          </lineSegments>
        );
      })}

      {/* Cluster Star Nodes & Interactive Hover Pins */}
      {SKILL_CLUSTERS.map((cluster) => {
        const isClusterActive =
          !activeClusterId || activeClusterId === cluster.id;

        return (
          <group key={cluster.id}>
            {cluster.nodes.map((node) => {
              const isHovered = hoveredNodeId === node.id;

              return (
                <group key={node.id} position={node.pos}>
                  {/* Generous Invisible Hit-Area Sphere (Radius 0.65 for effortless hover/touch targeting) */}
                  <mesh
                    visible={false}
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      onHoverNode && onHoverNode(node.id, cluster.name, node.label);
                    }}
                    onPointerOut={(e) => {
                      e.stopPropagation();
                      onHoverNode && onHoverNode(null);
                    }}
                  >
                    <sphereGeometry args={[0.65, 8, 8]} />
                    <meshBasicMaterial />
                  </mesh>

                  {/* Outer Pulsing Glow Halo */}
                  <mesh scale={isHovered ? [2.4, 2.4, 2.4] : [1.4, 1.4, 1.4]}>
                    <sphereGeometry args={[0.22, 10, 10]} />
                    <meshBasicMaterial
                      color={cluster.color}
                      transparent
                      opacity={isHovered ? 0.85 : isClusterActive ? 0.4 : 0.12}
                    />
                  </mesh>

                  {/* Classic 5-Point Star Polygon Mesh */}
                  <mesh
                    geometry={starGeo}
                    scale={isHovered ? [1.5, 1.5, 1.5] : [1.0, 1.0, 1.0]}
                  >
                    <meshStandardMaterial
                      color={cluster.color}
                      emissive={cluster.emissive}
                      emissiveIntensity={isHovered ? 2.8 : isClusterActive ? 1.4 : 0.4}
                      roughness={0.2}
                      metalness={0.6}
                      flatShading
                    />
                  </mesh>

                  {/* Floating HTML Label Badge on Hover / Active */}
                  {isHovered && (
                    <Html
                      position={[0, 0.55, 0]}
                      center
                      distanceFactor={18}
                      zIndexRange={[100, 0]}
                    >
                      <div className="pointer-events-none animate-fadeIn select-none">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg backdrop-blur-xl ${cluster.badgeBg} border ${cluster.badgeBorder} shadow-[0_0_25px_${cluster.glowColor}] text-white`}
                        >
                          <span
                            className="w-2 h-2 rounded-full animate-ping"
                            style={{ backgroundColor: cluster.color }}
                          />
                          <div className="text-left font-mono">
                            <div className="text-[8px] uppercase tracking-widest opacity-80">
                              {cluster.name}
                            </div>
                            <div className="text-xs font-bold whitespace-nowrap">
                              {node.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Html>
                  )}
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
