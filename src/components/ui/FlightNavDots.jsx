import React, { useState } from 'react';
import { PLANETS } from '../../data/planetsData';

export default function FlightNavDots({
  activePlanetIndex = 0,
  scrollProgress = 0,
  onJumpToPlanet,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Milestone color tokens matching each planet's aesthetic
  const PLANET_COLORS = [
    { text: 'text-cyan-300', bg: 'bg-cyan-400', border: 'border-cyan-400/80', glow: 'shadow-cyan-400/50' },
    { text: 'text-cyan-200', bg: 'bg-cyan-300', border: 'border-cyan-300/80', glow: 'shadow-cyan-300/50' },
    { text: 'text-orange-300', bg: 'bg-orange-400', border: 'border-orange-400/80', glow: 'shadow-orange-400/50' },
    { text: 'text-sky-300', bg: 'bg-sky-400', border: 'border-sky-400/80', glow: 'shadow-sky-400/50' },
    { text: 'text-amber-300', bg: 'bg-amber-400', border: 'border-amber-400/80', glow: 'shadow-amber-400/50' },
  ];

  return (
    <nav
      aria-label="Planet Navigation Rail"
      className="pointer-events-auto fixed right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 select-none"
    >
      <div className="relative flex flex-col items-center py-4 px-2 rounded-full backdrop-blur-xl bg-slate-950/70 border border-slate-800/80 shadow-2xl">
        {/* Background Track Rail */}
        <div className="absolute top-6 bottom-6 w-0.5 bg-slate-800/90 rounded-full pointer-events-none" />

        {/* Dynamic Progress Fill Line */}
        <div
          className="absolute top-6 w-0.5 bg-gradient-to-b from-cyan-400 via-sky-400 to-amber-400 rounded-full pointer-events-none transition-all duration-150"
          style={{
            height: `${Math.max(0, Math.min(100, scrollProgress * 100)) * 0.82}%`,
          }}
        />

        {/* 5 Milestone Dot Indicators */}
        <div className="relative flex flex-col items-center space-y-7 z-10">
          {PLANETS.map((planet, idx) => {
            const isActive = activePlanetIndex === idx;
            const isHovered = hoveredIdx === idx;
            const colors = PLANET_COLORS[idx] || PLANET_COLORS[0];

            return (
              <div
                key={planet.id}
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Interactive Dot Trigger Button */}
                <button
                  onClick={() => onJumpToPlanet && onJumpToPlanet(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onJumpToPlanet && onJumpToPlanet(idx);
                    }
                  }}
                  onFocus={() => setHoveredIdx(idx)}
                  onBlur={() => setHoveredIdx(null)}
                  aria-label={`Jump to Sector 0${idx + 1}: ${planet.section} on ${planet.name}${isActive ? ' (Current Sector)' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                  className="relative group p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer flex items-center justify-center"
                >
                  {/* Outer Pulsing Glow Aura when active */}
                  {isActive && (
                    <span
                      className={`absolute w-7 h-7 rounded-full animate-ping opacity-60 ${colors.bg}`}
                    />
                  )}

                  {/* Outer Orbit Reticle Ring */}
                  <span
                    className={`absolute rounded-full transition-all duration-300 ${
                      isActive
                        ? `w-6 h-6 border-2 ${colors.border} shadow-[0_0_15px_rgba(34,211,238,0.5)] ${colors.glow}`
                        : isHovered
                        ? 'w-5 h-5 border border-slate-500 bg-slate-800/60'
                        : 'w-4 h-4 border border-transparent'
                    }`}
                  />

                  {/* Core Planet Dot */}
                  <span
                    className={`relative rounded-full transition-all duration-300 ${
                      isActive
                        ? `w-3 h-3 ${colors.bg} shadow-md`
                        : isHovered
                        ? `w-2.5 h-2.5 ${colors.bg}`
                        : 'w-2 h-2 bg-slate-500 group-hover:bg-slate-300'
                    }`}
                  />
                </button>

                {/* Minimal Flyout Tooltip (Slides out smoothly to the left on hover or active) */}
                {(isHovered || (isActive && hoveredIdx === null)) && (
                  <div
                    className={`absolute right-10 whitespace-nowrap pointer-events-none transition-all duration-200 transform ${
                      isHovered
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 sm:opacity-90 translate-x-1'
                    }`}
                  >
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl backdrop-blur-xl bg-slate-950/90 border border-slate-800/90 shadow-2xl panel-edge-flicker">
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        0{idx + 1}
                      </span>
                      <span className="text-slate-700 font-mono text-xs">/</span>
                      <div className="flex flex-col text-left">
                        <span
                          className={`font-mono text-[11px] font-bold tracking-wider uppercase ${
                            isActive ? colors.text : 'text-slate-200'
                          }`}
                        >
                          {planet.section}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {planet.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
