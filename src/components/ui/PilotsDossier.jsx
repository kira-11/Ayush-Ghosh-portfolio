import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Award, GraduationCap, ChevronDown, ChevronUp, Cpu, Radio, Sparkles } from 'lucide-react';
import { PILOT_PROFILE } from '../../data/portfolioContent';

const TRANSMISSION_LINES = [
  "> INCOMING TRANSMISSION...",
  `> PILOT ID: ${PILOT_PROFILE.name}`,
  `> SPECIALIZATION: ${PILOT_PROFILE.role}`,
  `> STATUS: ${PILOT_PROFILE.status}`,
];

export default function PilotsDossier({
  isVisible = true,
  onTypingChange,
}) {
  const [typedLines, setTypedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const typingTimerRef = useRef(null);

  // Typewriter effect sequence
  useEffect(() => {
    if (!isVisible) {
      // Reset state if not visible
      setTypedLines([]);
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setIsTypingComplete(false);
      setIsExpanded(false);
      if (onTypingChange) onTypingChange(false);
      return;
    }

    // Inform parent that transmission typing is active
    if (!isTypingComplete && onTypingChange) {
      onTypingChange(true);
    }

    if (currentLineIndex < TRANSMISSION_LINES.length) {
      const targetLine = TRANSMISSION_LINES[currentLineIndex];

      if (currentCharIndex < targetLine.length) {
        typingTimerRef.current = setTimeout(() => {
          setCurrentCharIndex((prev) => prev + 1);
        }, 28 + Math.random() * 20); // Authentic terminal transmission jitter
      } else {
        // Line completed, short pause before next line
        typingTimerRef.current = setTimeout(() => {
          setTypedLines((prev) => [...prev, targetLine]);
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 180);
      }
    } else {
      // All lines completed
      setIsTypingComplete(true);
      if (onTypingChange) onTypingChange(false);
    }

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [isVisible, currentLineIndex, currentCharIndex, isTypingComplete, onTypingChange]);

  // Current active typing line text
  const currentTypingText =
    currentLineIndex < TRANSMISSION_LINES.length
      ? TRANSMISSION_LINES[currentLineIndex].slice(0, currentCharIndex)
      : '';

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Pilot Dossier"
      className="pointer-events-auto absolute left-4 sm:left-8 md:left-12 top-20 sm:top-24 max-w-[92vw] sm:max-w-md md:max-w-lg z-20 transition-all duration-700 ease-out"
    >
      <div className="relative rounded-xl backdrop-blur-xl bg-slate-950/85 border border-cyan-500/40 p-5 md:p-6 shadow-[0_0_50px_rgba(6,182,212,0.18)] panel-edge-flicker overflow-hidden text-slate-100">
        
        {/* Subtle CRT Scanlines texture */}
        <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />

        {/* Futuristic Corner Reticle Brackets */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

        {/* Header telemetry ribbon */}
        <div className="relative flex items-center justify-between border-b border-cyan-900/60 pb-3 mb-3.5">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-glow-cyan">
              PILOT&apos;S DOSSIER // ALPHA-01
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="font-mono text-[10px] text-cyan-300/80 tracking-wider">
              ENCRYPTED COMMS
            </span>
          </div>
        </div>

        {/* Typewriter Terminal Readout */}
        <div className="relative font-mono text-xs md:text-sm text-cyan-300 space-y-1 bg-slate-900/60 p-3 rounded-lg border border-cyan-950/80 shadow-inner">
          {typedLines.map((line, idx) => (
            <div key={idx} className="tracking-wide">
              {line.startsWith('> PILOT ID:') ? (
                <span>
                  &gt; PILOT ID:{' '}
                  <strong className="text-white font-bold">{line.replace('> PILOT ID:', '')}</strong>
                </span>
              ) : line.startsWith('> STATUS:') ? (
                <span>
                  &gt; STATUS:{' '}
                  <span className="text-emerald-400 font-semibold">
                    {line.replace('> STATUS:', '')}
                  </span>
                </span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}

          {/* Active typing line with blinking terminal cursor */}
          {!isTypingComplete && (
            <div className="tracking-wide text-cyan-200">
              {currentTypingText}
              <span className="animate-pulse text-cyan-400 font-bold ml-0.5">▋</span>
            </div>
          )}
        </div>

        {/* Bio Paragraph: Fades in smoothly once typewriter transmission completes */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            isTypingComplete
              ? 'opacity-100 translate-y-0 mt-4'
              : 'opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          <div className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal border-l-2 border-cyan-500/60 pl-3.5 py-0.5">
            {PILOT_PROFILE.bio}
          </div>

          {/* Quick Skill Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3.5 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
            {PILOT_PROFILE.skillTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Toggle Button: [ VIEW FULL DOSSIER ] */}
          <div className="mt-4 pt-2 flex items-center justify-between">
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls="pilot-full-dossier"
              aria-label={isExpanded ? 'Hide full pilot dossier education and certification details' : 'View full pilot dossier education and certification details'}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-mono tracking-wider transition-all duration-200 shadow-md hover:shadow-cyan-500/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <span>{isExpanded ? '[ HIDE DOSSIER ]' : '[ VIEW FULL DOSSIER ]'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>

            <span className="font-mono text-[10px] text-slate-500">
              SECTOR 01 // ORIGIN BASE
            </span>
          </div>

          {/* Expanded Section: Education and Certification Details */}
          {isExpanded && (
            <div
              id="pilot-full-dossier"
              aria-live="polite"
              className="mt-4 pt-3.5 border-t border-cyan-900/40 space-y-3.5 animate-fadeIn"
            >
              {/* Education Block */}
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 font-semibold mb-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>EDUCATION & ACADEMICS</span>
                </div>
                <div className="space-y-2 text-xs font-sans text-slate-300 pl-2 border-l border-slate-800">
                  {PILOT_PROFILE.education.map((edu, idx) => (
                    <div key={idx} className={idx > 0 ? 'pt-1' : ''}>
                      <div className="font-semibold text-slate-100">
                        {edu.degree}
                      </div>
                      {edu.specialization && (
                        <div className="text-cyan-300/90 font-mono text-[11px]">
                          Specialization: {edu.specialization}
                        </div>
                      )}
                      <div className="text-slate-400 text-[11px]">
                        {edu.institution} ({edu.period})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certification Block */}
              <div className="pt-1">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 font-semibold mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>CREDENTIALS &amp; CERTIFICATION</span>
                </div>
                <div className="text-xs font-sans text-slate-300 pl-2 border-l border-slate-800">
                  {PILOT_PROFILE.certifications.map((cert, idx) => (
                    <div key={idx}>
                      <div className="font-semibold text-slate-100">
                        {cert.name}
                      </div>
                      <div className="text-cyan-300/90 font-mono text-[11px]">
                        {cert.issuer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
