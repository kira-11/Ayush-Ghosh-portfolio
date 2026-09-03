import React from 'react';
import { Html } from '@react-three/drei';
import { Cloud, Terminal } from 'lucide-react';

export default function OutpostLandmarks({ selectedOutpost, onSelectOutpost }) {
  return (
    <group>
      {/* ========================================================= */}
      {/* OUTPOST A: COGNIZANT (Cloud / Infrastructure Facility)   */}
      {/* Positioned on front-left surface of Basalt Reach          */}
      {/* ========================================================= */}
      <group position={[18.5, 9.0, -36.0]}>
        {/* Physical 3D Low-Poly Server Bunker */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.9, 1.1]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.5}
            metalness={0.4}
            flatShading
          />
        </mesh>

        {/* Server Rack Cooling Vents / Glow Slits */}
        <mesh position={[0, 0.45, 0.56]}>
          <planeGeometry args={[0.9, 0.6]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Satellite Dish Antenna */}
        <group position={[0.3, 0.95, -0.2]} rotation={[0.4, 0.6, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
            <meshStandardMaterial color="#64748b" flatShading />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.35, 0.15, 8]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* Glowing Foundation Signal Ring */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.1, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>

        {/* Clickable 3D Floating Outpost Beacon Pin */}
        <Html position={[0, 1.8, 0]} center distanceFactor={16} zIndexRange={[100, 0]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectOutpost && onSelectOutpost(selectedOutpost === 'A' ? null : 'A');
            }}
            className={`pointer-events-auto group flex items-center space-x-2 px-2.5 py-1.5 rounded-lg backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
              selectedOutpost === 'A'
                ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-cyan-500/30 scale-105'
                : 'bg-slate-950/80 border-cyan-500/40 text-cyan-300 hover:border-cyan-300 hover:bg-slate-900/90 hover:scale-105'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <Cloud className="w-3.5 h-3.5 text-cyan-300 group-hover:text-white" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-cyan-400/80 tracking-widest uppercase">OUTPOST A</div>
              <div className="text-xs font-bold whitespace-nowrap">COGNIZANT</div>
            </div>
          </button>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* OUTPOST B: ACCENTURE (Terminal / Software Spire)          */}
      {/* Positioned on front-right surface of Basalt Reach         */}
      {/* ========================================================= */}
      <group position={[25.5, 9.0, -36.5]}>
        {/* Physical 3D Low-Poly Command Spire */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.8, 1.4, 6]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.6}
            metalness={0.5}
            flatShading
          />
        </mesh>

        {/* Transmission Antenna Mast */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.9, 6]} />
          <meshStandardMaterial color="#94a3b8" flatShading />
        </mesh>

        {/* Glowing Pulsing Antenna Beacon Orb */}
        <mesh position={[0, 2.2, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>

        {/* Ground Emissive Beacon Ring */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.15, 16]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
        </mesh>

        {/* Clickable 3D Floating Outpost Beacon Pin */}
        <Html position={[0, 2.7, 0]} center distanceFactor={16} zIndexRange={[100, 0]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectOutpost && onSelectOutpost(selectedOutpost === 'B' ? null : 'B');
            }}
            className={`pointer-events-auto group flex items-center space-x-2 px-2.5 py-1.5 rounded-lg backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
              selectedOutpost === 'B'
                ? 'bg-purple-950/90 border-purple-400 text-white shadow-purple-500/30 scale-105'
                : 'bg-slate-950/80 border-purple-500/40 text-purple-300 hover:border-purple-300 hover:bg-slate-900/90 hover:scale-105'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400" />
            </span>
            <Terminal className="w-3.5 h-3.5 text-purple-300 group-hover:text-white" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-purple-400/80 tracking-widest uppercase">OUTPOST B</div>
              <div className="text-xs font-bold whitespace-nowrap">ACCENTURE</div>
            </div>
          </button>
        </Html>
      </group>
    </group>
  );
}
