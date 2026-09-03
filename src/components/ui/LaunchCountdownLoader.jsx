import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { ShieldCheck, Radio } from 'lucide-react';

export default function LaunchCountdownLoader({ onFinished }) {
  const { active, progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const canvasRef = useRef(null);

  // Smoothly interpolate progress counter towards real progress
  useEffect(() => {
    let animId;
    const updateProgress = () => {
      setDisplayProgress((prev) => {
        const target = active ? Math.max(prev, progress) : 100;
        const next = prev + (target - prev) * 0.12;
        if (target >= 99 && Math.abs(next - 100) < 0.8) {
          setIsDone(true);
          setTimeout(() => onFinished && onFinished(), 800);
          return 100;
        }
        return Math.min(100, next);
      });
      animId = requestAnimationFrame(updateProgress);
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [active, progress, onFinished]);

  // Animated engine thruster spark particle simulation (matching close-up thruster test video)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const W = (canvas.width = 360);
    const H = (canvas.height = 180);

    // Particles emitting directly from the engine nozzle mouth at (W / 2, 8)
    const particles = Array.from({ length: 50 }).map(() => ({
      x: W / 2 + (Math.random() - 0.5) * 46, // nozzle mouth width
      y: 6 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 4.8,
      vy: 1.8 + Math.random() * 4.8,
      size: 1.2 + Math.random() * 2.2,
      life: Math.random(),
      maxLife: 0.5 + Math.random() * 0.5,
      color:
        Math.random() > 0.35
          ? Math.random() > 0.5
            ? '#67e8f9'
            : '#38bdf8'
          : Math.random() > 0.5
          ? '#fef08a'
          : '#f59e0b',
    }));

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Glowing engine throat pre-heat jet plume
      const plumeGrad = ctx.createRadialGradient(W / 2, 8, 3, W / 2, 28, 48);
      plumeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      plumeGrad.addColorStop(0.2, 'rgba(103, 232, 249, 0.85)');
      plumeGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.35)');
      plumeGrad.addColorStop(1, 'rgba(8, 13, 26, 0)');

      ctx.fillStyle = plumeGrad;
      ctx.beginPath();
      ctx.ellipse(W / 2, 24, 34, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spark particles falling and bouncing
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity pulling sparks downward
        p.life += 0.024;

        // Ground scatter bounce
        if (p.y > H - 10) {
          p.vy = -p.vy * 0.32;
          p.vx *= 1.25;
        }

        if (p.life >= p.maxLife || p.y > H) {
          p.x = W / 2 + (Math.random() - 0.5) * 46;
          p.y = 6 + Math.random() * 6;
          p.vx = (Math.random() - 0.5) * 4.8;
          p.vy = 1.8 + Math.random() * 4.8;
          p.life = 0;
        }

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const pVal = Math.floor(displayProgress);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080d1a] transition-all duration-700 ease-out select-none ${
        isDone ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background CRT Scanlines */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />

      {/* Radiant Background Cyan Ambient Core */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Main Systems Check Vessel Card */}
      <div className="relative z-10 max-w-md w-full mx-4 rounded-2xl backdrop-blur-2xl bg-slate-950/90 border border-cyan-500/40 p-6 md:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] panel-edge-flicker">
        {/* Reticle Corner Brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/80" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/80" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/80" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/80" />

        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-800/90 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-glow-cyan">
              MISSION LAUNCH CONTROL // SYSTEMS CHECK
            </span>
          </div>
          <span className="font-mono text-xs text-slate-400">VITE::R3F</span>
        </div>

        {/* Stylized Rocket Thruster Engine Nozzle (Matching 3D Rocket Scene) */}
        <div className="relative flex flex-col items-center justify-center my-3">
          {/* HUD Telemetry Beacon Status Indicator */}
          <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400/90 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="tracking-widest uppercase font-semibold">
              BEACON: SYNC // PRIMARY ENGINE PRE-HEAT
            </span>
          </div>

          {/* Engine Nozzle Visual Assembly (Gunmetal Bell matching Rocket.jsx) */}
          <div className="relative w-44 flex flex-col items-center">
            {/* Upper Rocket Fuselage Mount / Collar (Off-white hull facet) */}
            <div className="w-24 h-3.5 bg-gradient-to-b from-slate-200 to-slate-400 rounded-t-md border-t border-x border-slate-300 shadow-sm flex items-center justify-between px-3">
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
            </div>

            {/* Manifold Collar Ring (Gunmetal grey) */}
            <div className="w-28 h-3 bg-slate-900 border-x border-slate-700 shadow-inner flex items-center justify-center">
              <div className="w-20 h-0.5 bg-slate-700 rounded-full" />
            </div>

            {/* Flared Engine Bell Nozzle (Tapered trapezoid with facets and glowing throat) */}
            <div className="relative w-36 h-14 flex items-center justify-center">
              <svg
                viewBox="0 0 144 56"
                className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              >
                <defs>
                  <linearGradient id="loaderNozzleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="20%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#475569" />
                    <stop offset="80%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <radialGradient id="loaderThroatGlow" cx="50%" cy="100%" r="75%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="35%" stopColor="#67e8f9" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Flared Bell Body */}
                <polygon
                  points="22,1 122,1 136,46 8,46"
                  fill="url(#loaderNozzleGrad)"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Nozzle Cooling Ribs / Structural Facets */}
                <line x1="42" y1="1" x2="36" y2="46" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="62" y1="1" x2="60" y2="46" stroke="#64748b" strokeWidth="1" />
                <line x1="82" y1="1" x2="84" y2="46" stroke="#64748b" strokeWidth="1" />
                <line x1="102" y1="1" x2="108" y2="46" stroke="#1e293b" strokeWidth="1.5" />
                {/* Exhaust Mouth Rim */}
                <ellipse cx="72" cy="46" rx="64" ry="6.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                {/* Glowing Interior Throat Disc (Glowing cyan matching engine in Rocket.jsx) */}
                <ellipse
                  cx="72"
                  cy="46"
                  rx="56"
                  ry="5"
                  fill="url(#loaderThroatGlow)"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>

          {/* Spark Particle Simulation Canvas (falling sparks beneath nozzle) */}
          <canvas
            ref={canvasRef}
            className="w-72 h-32 -mt-1 pointer-events-none"
          />
        </div>

        {/* Diagnostic Telemetry Checklist */}
        <div className="space-y-1.5 font-mono text-[11px] text-slate-300 mb-5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">&gt; 01. INERTIAL SENSORS:</span>
            <span className={pVal >= 25 ? 'text-emerald-400 font-bold' : 'text-slate-600 animate-pulse'}>
              {pVal >= 25 ? '[ CALIBRATED ]' : '[ SCANNING... ]'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">&gt; 02. CRYOGENIC IGNITION:</span>
            <span className={pVal >= 50 ? 'text-emerald-400 font-bold' : 'text-slate-600 animate-pulse'}>
              {pVal >= 50 ? '[ ARMED & READY ]' : '[ PRESSURIZING ]'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">&gt; 03. CELESTIAL SPLINE:</span>
            <span className={pVal >= 75 ? 'text-emerald-400 font-bold' : 'text-slate-600 animate-pulse'}>
              {pVal >= 75 ? '[ TRAJECTORY LOCKED ]' : '[ COMPUTING ]'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">&gt; 04. FLIGHT TELEMETRY:</span>
            <span className={pVal >= 98 ? 'text-cyan-300 font-bold' : 'text-slate-600 animate-pulse'}>
              {pVal >= 98 ? '[ ALL SYSTEMS NOMINAL ]' : '[ SYNCING ]'}
            </span>
          </div>
        </div>

        {/* Progress Bar & Numeric Readout */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400 uppercase tracking-wider">
              {pVal < 100 ? 'IGNITION CHARGE' : 'COUNTDOWN ZERO // LAUNCH'}
            </span>
            <span className="font-bold text-cyan-300 text-glow-cyan text-sm">
              {pVal}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-150 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
              style={{ width: `${pVal}%` }}
            />
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <ShieldCheck className="w-3 h-3" />
            <span>AUTHENTICATION VERIFIED</span>
          </div>
          <button
            onClick={() => {
              setIsDone(true);
              if (onFinished) onFinished();
            }}
            aria-label="Fast Initialize: Skip countdown systems check and launch directly into 3D experience"
            className="text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1"
          >
            [ FAST INITIALIZE ↗ ]
          </button>
        </div>
      </div>
    </div>
  );
}
