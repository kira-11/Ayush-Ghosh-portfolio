import React, { useState, useEffect } from 'react';
import { Compass, Radio, ChevronDown, Rocket, ShieldCheck, Gauge } from 'lucide-react';
import { PLANETS } from '../../data/planetsData';

export default function HudOverlay({ telemetry, onJumpToPlanet, onToggleReducedMotion }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const flightState = telemetry?.flightState || 'IDLE';
  const isLanded = flightState === 'IDLE' || flightState === 'TOUCHDOWN';

  // Badge styling according to flight state
  const getFlightStateBadge = () => {
    switch (flightState) {
      case 'LIFTOFF':
        return {
          text: 'ORBITAL LIFTOFF',
          color: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
          dot: 'bg-amber-400 animate-ping',
        };
      case 'CRUISE':
        return {
          text: 'SUB-LIGHT CRUISE',
          color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40',
          dot: 'bg-cyan-400 animate-pulse',
        };
      case 'DESCENT':
        return {
          text: 'RETRO-DESCENT',
          color: 'text-orange-400 border-orange-500/40 bg-orange-950/40',
          dot: 'bg-orange-400 animate-pulse',
        };
      case 'TOUCHDOWN':
        return {
          text: 'TOUCHDOWN IMPACT',
          color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50',
          dot: 'bg-emerald-400 animate-ping',
        };
      case 'IDLE':
      default:
        return {
          text: 'SURFACE TOUCHDOWN',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
          dot: 'bg-emerald-400',
        };
    }
  };

  const badge = getFlightStateBadge();

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 select-none z-10">
      {/* Top Navigation & Mission Bar */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full">
        {/* Mission Brand / Identity */}
        <div className="pointer-events-auto flex items-center space-x-3 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 px-4 py-2.5 rounded-xl shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] tracking-widest text-cyan-400 font-bold uppercase">
                Mission Odyssey
              </span>
              <span className="text-[10px] text-slate-500">•</span>
              <span className="font-mono text-[10px] text-slate-400">STEP 02</span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-slate-100 tracking-wider flex items-center gap-2">
              5-PLANET FLIGHT SYSTEM
            </h1>
          </div>
        </div>

        {/* 5-Planet Milestone Tracker Tabs */}
        <nav
          aria-label="Planetary Sectors"
          className="pointer-events-auto flex items-center space-x-1.5 md:space-x-2 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 p-1.5 rounded-xl shadow-2xl overflow-x-auto max-w-full"
        >
          {PLANETS.map((planet, idx) => {
            const isCurrent = telemetry?.planetIndex === idx;
            return (
              <button
                key={planet.id}
                onClick={() => onJumpToPlanet && onJumpToPlanet(idx)}
                aria-label={`Jump to Sector 0${idx + 1}: ${planet.section} on ${planet.name}${isCurrent ? ' (Current Sector)' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span className="text-[10px] opacity-60">0{idx + 1}</span>
                <span className="font-medium hidden sm:inline">{planet.name}</span>
                <span className="font-medium sm:hidden">{planet.code}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Telemetry Pill & Accessibility Motion Switch */}
        <div className="flex pointer-events-auto items-center space-x-2.5">
          {onToggleReducedMotion && (
            <button
              onClick={onToggleReducedMotion}
              title="Switch to static normal-scrolling version (Reduced Motion)"
              aria-label="Toggle Reduced Motion mode: Switch to static accessible version"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl backdrop-blur-md bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/80 hover:border-cyan-400/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>⚡</span>
              <span>REDUCED MOTION</span>
            </button>
          )}

          <div className="hidden lg:flex items-center space-x-3 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-2xl">
            <div className="flex items-center space-x-1.5 text-cyan-300">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>BEACON: SYNC</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300 font-semibold">{time || '00:00:00'} IST</span>
          </div>
        </div>
      </header>

      {/* Center Flight Status Badge */}
      <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-none">
        {/* Dynamic Flight Status Pill */}
        <div
          className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-3 shadow-xl backdrop-blur-md transition-all duration-300 ${badge.color}`}
        >
          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
          <span className="font-bold">{badge.text}</span>
          <span className="opacity-50">/</span>
          <span>{telemetry?.planetName || 'ORIGIN OUTPOST'}</span>
        </div>

        {isLanded ? (
          <div className="animate-bounce mt-4 flex flex-col items-center pointer-events-none">
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
              Scroll Down to Lift Off
            </span>
            <ChevronDown className="w-4 h-4 text-cyan-400 mt-1" />
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mt-2 backdrop-blur-sm bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800/60">
            <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>EN ROUTE TO {PLANETS[(telemetry?.planetIndex + 1) % PLANETS.length]?.name}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer Telemetry */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        {/* Real-Time Flight Dynamics Readout */}
        <div className="pointer-events-auto flex items-center space-x-3 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-2xl">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Gauge className="w-3.5 h-3.5" />
            <span>SECTOR: {telemetry?.planetCode || 'ALPHA-01'}</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span>ALT: {((telemetry?.altitude || 0) * 10).toFixed(1)}m</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>THRUSTER: {flightState === 'CRUISE' ? 'BURNING 100%' : 'NOMINAL'}</span>
          </div>
        </div>

        {/* Interactive Scroll & Orbit Hint */}
        <div className="pointer-events-auto flex items-center space-x-2 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 shadow-2xl">
          <span>SCROLL TO TRAVEL &bull; CURVED 3D FLIGHT PATH</span>
        </div>
      </footer>
    </div>
  );
}
