import React from 'react';
import { Html } from '@react-three/drei';
import { Brain, Activity, Sparkles } from 'lucide-react';

export default function ProjectLandmarks({ selectedProject, onSelectProject }) {
  return (
    <group>
      {/* ========================================================= */}
      {/* LANDMARK 1: BRAIN TUMOR CLASSIFICATION (MRI Bio-Chamber) */}
      {/* Surface of Rust Dunes (Front-Left of Touchdown Pad)      */}
      {/* ========================================================= */}
      <group position={[-21.8, 18.0, -76.2]}>
        {/* Low-Poly Scanner Chamber / Dome Base */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 1.2, 1.0, 8]} />
          <meshStandardMaterial
            color="#451a03"
            roughness={0.7}
            metalness={0.3}
            flatShading
          />
        </mesh>

        {/* Inner Resonance Gantry Core */}
        <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.65, 0.12, 8, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Emissive Ground Scanner Ring */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.35, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </mesh>

        {/* Clickable 3D Floating Project Pin */}
        <Html position={[0, 2.0, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject && onSelectProject(selectedProject === 'brain-tumor' ? null : 'brain-tumor');
            }}
            className={`pointer-events-auto group flex items-center space-x-2 px-3 py-1.5 rounded-lg backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
              selectedProject === 'brain-tumor'
                ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-cyan-500/30 scale-105'
                : 'bg-slate-950/85 border-cyan-500/40 text-cyan-300 hover:border-cyan-300 hover:bg-slate-900/90 hover:scale-105'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <Brain className="w-3.5 h-3.5 text-cyan-300 group-hover:text-white" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-cyan-400/80 tracking-widest uppercase">PROJECT 01</div>
              <div className="text-xs font-bold whitespace-nowrap">BRAIN TUMOR AI</div>
            </div>
          </button>
        </Html>
      </group>

      {/* ========================================================= */}
      {/* LANDMARK 2: MOVEMENT TRACKING SYSTEM (Pose Sensor Spire)  */}
      {/* Surface of Rust Dunes (Front-Right of Touchdown Pad)     */}
      {/* ========================================================= */}
      <group position={[-14.2, 18.0, -76.5]}>
        {/* Kinetic Pose Tracker Spire Base */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.75, 1.3, 6]} />
          <meshStandardMaterial
            color="#3b0764"
            roughness={0.6}
            metalness={0.4}
            flatShading
          />
        </mesh>

        {/* Articulated Camera Gimbal Sensor */}
        <mesh position={[0, 1.5, 0]}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#c084fc"
            emissiveIntensity={0.6}
            flatShading
          />
        </mesh>

        {/* Emissive Ground Calibration Ring */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.2, 16]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.65} />
        </mesh>

        {/* Clickable 3D Floating Project Pin */}
        <Html position={[0, 2.3, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject && onSelectProject(selectedProject === 'motion-tracking' ? null : 'motion-tracking');
            }}
            className={`pointer-events-auto group flex items-center space-x-2 px-3 py-1.5 rounded-lg backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
              selectedProject === 'motion-tracking'
                ? 'bg-purple-950/90 border-purple-400 text-white shadow-purple-500/30 scale-105'
                : 'bg-slate-950/85 border-purple-500/40 text-purple-300 hover:border-purple-300 hover:bg-slate-900/90 hover:scale-105'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400" />
            </span>
            <Activity className="w-3.5 h-3.5 text-purple-300 group-hover:text-white" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-purple-400/80 tracking-widest uppercase">PROJECT 02</div>
              <div className="text-xs font-bold whitespace-nowrap">POSE TRACKING</div>
            </div>
          </button>
        </Html>
      </group>
    </group>
  );
}
