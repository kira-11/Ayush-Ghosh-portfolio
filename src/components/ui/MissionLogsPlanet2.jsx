import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Terminal, Shield, Cpu, X, Server, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { OUTPOST_DATA } from '../../data/portfolioContent';

const OUTPOST_ICONS = {
  A: Cloud,
  B: Terminal,
};

export default function MissionLogsPlanet2({
  isVisible = true,
  selectedOutpost,
  onSelectOutpost,
  onTypingChange,
}) {
  // Store typed logs for Outpost A and Outpost B
  const [typedCounts, setTypedCounts] = useState({ A: 0, B: 0 });
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef(null);

  // Trigger fast typewriter when an outpost is selected
  useEffect(() => {
    if (!isVisible || !selectedOutpost) {
      setIsTyping(false);
      if (onTypingChange) onTypingChange(false);
      return;
    }

    const currentOutpost = OUTPOST_DATA[selectedOutpost];
    if (!currentOutpost) return;

    // Reset typewriter for current outpost
    setTypedCounts((prev) => ({ ...prev, [selectedOutpost]: 0 }));
    setCharIndex(0);
    setIsTyping(true);
    if (onTypingChange) onTypingChange(true);
  }, [selectedOutpost, isVisible]);

  // Fast character-by-character typing loop
  useEffect(() => {
    if (!isTyping || !selectedOutpost) return;

    const currentOutpost = OUTPOST_DATA[selectedOutpost];
    const totalLogs = currentOutpost.logs.length;
    const currentLogIdx = typedCounts[selectedOutpost];

    if (currentLogIdx < totalLogs) {
      const targetText = currentOutpost.logs[currentLogIdx];
      if (charIndex < targetText.length) {
        timerRef.current = setTimeout(() => {
          setCharIndex((prev) => prev + 2); // Faster reveal for mission logs
        }, 18);
      } else {
        // Line finished, advance to next log entry
        timerRef.current = setTimeout(() => {
          setTypedCounts((prev) => ({
            ...prev,
            [selectedOutpost]: prev[selectedOutpost] + 1,
          }));
          setCharIndex(0);
        }, 120);
      }
    } else {
      // Completed typing all logs for this outpost
      setIsTyping(false);
      if (onTypingChange) onTypingChange(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTyping, selectedOutpost, charIndex, typedCounts]);

  if (!isVisible) return null;

  const data = selectedOutpost ? OUTPOST_DATA[selectedOutpost] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-8">
      {/* Top Banner: Outpost Selection Prompter / Switcher */}
      <div className="pointer-events-auto flex items-center justify-between mx-auto max-w-2xl w-full mt-16 sm:mt-20">
        <div className="flex items-center space-x-2 backdrop-blur-xl bg-slate-950/85 border border-slate-800/80 px-4 py-2 rounded-xl shadow-2xl text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">PLANET 02 // BASALT REACH:</span>
          <span className="font-semibold text-white">SELECT SURFACE OUTPOST</span>
        </div>

        {/* Quick Outpost Selector Buttons */}
        <div className="flex items-center space-x-2" role="group" aria-label="Surface Outposts">
          <button
            onClick={() => onSelectOutpost(selectedOutpost === 'A' ? null : 'A')}
            aria-label="Toggle Outpost A (Cognizant): Cloud Infrastructure Services Training Mission Logs"
            aria-pressed={selectedOutpost === 'A'}
            className={`pointer-events-auto px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
              selectedOutpost === 'A'
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50'
            }`}
          >
            <Cloud className="w-3 h-3 text-cyan-400" />
            <span>OUTPOST A (COGNIZANT)</span>
          </button>

          <button
            onClick={() => onSelectOutpost(selectedOutpost === 'B' ? null : 'B')}
            aria-label="Toggle Outpost B (Accenture): Software Engineering & Python Automation Mission Logs"
            aria-pressed={selectedOutpost === 'B'}
            className={`pointer-events-auto px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer ${
              selectedOutpost === 'B'
                ? 'bg-purple-950/90 border-purple-400 text-purple-300 shadow-lg shadow-purple-950'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/50'
            }`}
          >
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>OUTPOST B (ACCENTURE)</span>
          </button>
        </div>
      </div>

      {/* Main Mission Log Panel (Opens when an outpost is selected) */}
      {data && (
        <aside
          aria-label="Mission Log Panel"
          className="pointer-events-auto mx-auto max-w-xl w-full my-auto transition-all duration-500 ease-out animate-fadeIn"
        >
          <div className="relative rounded-xl backdrop-blur-xl bg-slate-950/90 border border-cyan-500/40 p-5 md:p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] panel-edge-flicker overflow-hidden text-slate-100">
            {/* CRT Scanline Texture */}
            <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />

            {/* Futuristic Corner Brackets */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

            {/* Header: Outpost Identifier & Close Button */}
            <div className="relative flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`p-1.5 rounded-lg border ${
                    data.themeColor === 'cyan'
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                      : 'bg-purple-950/60 border-purple-500/50 text-purple-400'
                  }`}
                >
                  {(() => {
                    const IconComponent = OUTPOST_ICONS[selectedOutpost] || Cloud;
                    return <IconComponent className="w-4 h-4" aria-hidden="true" />;
                  })()}
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase font-bold text-glow-cyan">
                    {data.code} // DECRYPTED LOG
                  </div>
                  <h3 className="font-bold text-base text-white tracking-wide">{data.name}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                  {data.period}
                </span>
                <button
                  onClick={() => onSelectOutpost(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role Title Ribbon */}
            <div className="relative flex items-center space-x-2 font-mono text-xs mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">ASSIGNMENT:</span>
              <strong className="text-white font-semibold">{data.role}</strong>
              <span className="text-slate-600 sm:hidden">•</span>
              <span className="text-cyan-300 text-[11px] sm:hidden">{data.period}</span>
            </div>

            {/* Log Entries with Typewriter Text Animation */}
            <div className="relative space-y-3 font-sans text-xs md:text-sm text-slate-300">
              {data.logs.map((logText, idx) => {
                const currentCompletedCount = typedCounts[selectedOutpost] || 0;
                const isFullyTyped = idx < currentCompletedCount;
                const isCurrentlyTyping = idx === currentCompletedCount && isTyping;

                if (!isFullyTyped && !isCurrentlyTyping) return null;

                const textToDisplay = isCurrentlyTyping
                  ? logText.slice(0, charIndex)
                  : logText;

                return (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50"
                  >
                    <div className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50 mt-0.5 shrink-0">
                      LOG_0{idx + 1}
                    </div>
                    <div className="leading-relaxed flex-1">
                      {textToDisplay}
                      {isCurrentlyTyping && (
                        <span className="animate-pulse text-cyan-400 font-bold ml-1">▋</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Status Bar */}
            <div className="relative mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>LOG INTEGRITY: VERIFIED</span>
              </div>
              <button
                onClick={() => onSelectOutpost(null)}
                aria-label="Close Outpost Mission Log"
                className="hover:text-cyan-300 transition-colors uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 cursor-pointer"
              >
                [ CLOSE MISSION LOG ]
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Bottom Hint */}
      {!data && (
        <div className="pointer-events-none mx-auto mb-16 text-center">
          <div className="inline-flex items-center space-x-2 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 px-4 py-2 rounded-xl text-xs font-mono text-cyan-300 animate-pulse">
            <span>CLICK AN OUTPOST ON THE PLANET SURFACE OR IN THE TOP BAR TO VIEW LOGS</span>
          </div>
        </div>
      )}
    </div>
  );
}
