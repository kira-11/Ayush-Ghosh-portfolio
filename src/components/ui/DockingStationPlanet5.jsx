import React from 'react';
import {
  Mail,
  Github,
  Linkedin,
  FileDown,
  RotateCcw,
  CheckCircle2,
  PowerOff,
  Radio,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { PILOT_PROFILE, CONTACT_DATA } from '../../data/portfolioContent';

export default function DockingStationPlanet5({
  isVisible = true,
  onReplayMission,
}) {
  if (!isVisible) return null;

  return (
    <aside
      aria-label="Docking Station Control Panel"
      className="pointer-events-auto fixed left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 w-full max-w-[92vw] sm:max-w-md md:max-w-lg lg:max-w-xl z-20 transition-all duration-500 ease-out animate-fadeIn select-none space-y-2.5"
    >
      {/* Top Banner: Mission Status Readout */}
      <div className="backdrop-blur-xl bg-slate-950/85 border border-amber-500/40 px-4 py-2 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.15)] panel-edge-flicker flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-amber-400 font-bold text-glow-cyan">
              PLANET 05 // AMBER SANCTUM (SECTOR OMEGA-05)
            </div>
            <div className="font-mono text-xs font-bold text-white tracking-wide">
              DOCKING CRADLE 05: SECURED
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
          <PowerOff className="w-3 h-3 text-emerald-400" />
          <span className="font-semibold">ENGINES: STANDBY</span>
        </div>
      </div>

      {/* Main Docking Control Console (Fixed Left, Vertically Centered) */}
      <div className="relative rounded-2xl backdrop-blur-xl bg-slate-950/90 border border-amber-500/40 p-5 md:p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] panel-edge-flicker overflow-hidden text-slate-100">
        {/* Subtle CRT Scanline Texture */}
        <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-30" />

        {/* Futuristic Amber/Cyan Reticle Corner Brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

        {/* Control Console Header */}
        <div className="relative border-b border-slate-800 pb-3.5 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest uppercase font-bold text-glow-cyan">
                TERMINAL TRANSMISSION // MISSION COMPLETE
              </span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LINK SECURE</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {PILOT_PROFILE.name}
          </h3>
          <p className="font-mono text-xs text-amber-300/90 mt-0.5">
            {PILOT_PROFILE.role}
          </p>
        </div>

        {/* Mission Debriefing Message */}
        <div className="relative mb-5">
          <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed border-l-2 border-amber-500/60 pl-3">
            {CONTACT_DATA.message}
          </p>
        </div>

        {/* Action Controls Grid (Consistent size, spacing, and visual treatment) */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5" role="group" aria-label="Contact & Credential Actions">
          {/* 1. TRANSMIT EMAIL Button */}
          <a
            href={`mailto:${CONTACT_DATA.email}?subject=${encodeURIComponent(CONTACT_DATA.emailSubject)}`}
            aria-label={`Transmit email to ${PILOT_PROFILE.name} at ${CONTACT_DATA.email}`}
            className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-400/50 hover:border-cyan-300 shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 group-hover:text-white">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[9px] text-cyan-400 uppercase tracking-wider">
                  PRIMARY COMMS
                </div>
                <div className="text-xs font-bold text-white">
                  [ TRANSMIT EMAIL ]
                </div>
              </div>
            </div>
            <span className="font-mono text-xs text-cyan-300 group-hover:text-white transition-colors" aria-hidden="true">↗</span>
          </a>

          {/* 2. CREW PROFILE (LinkedIn) Button */}
          <a
            href={CONTACT_DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${PILOT_PROFILE.name}'s LinkedIn crew profile (opens in new tab)`}
            className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-500 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 group-hover:text-white">
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                  CREW PROFILE
                </div>
                <div className="text-xs font-bold text-white">
                  [ CREW PROFILE ]
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" aria-hidden="true" />
          </a>

          {/* 3. VIEW SOURCE LOG (GitHub) Button */}
          <a
            href={CONTACT_DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code and project repositories on GitHub (opens in new tab)"
            className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-500 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 group-hover:text-white">
                <Github className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                  GIT REPOSITORY
                </div>
                <div className="text-xs font-bold text-white">
                  [ VIEW SOURCE LOG ]
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" aria-hidden="true" />
          </a>

          {/* 4. RESUME DOWNLOAD Button */}
          <a
            href="/Ayush_Ghosh_Resume.pdf"
            download={CONTACT_DATA.resumeFilename}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Download ${PILOT_PROFILE.name}'s Resume in PDF format`}
            className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-amber-500/40 hover:border-amber-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-400 group-hover:text-amber-300">
                <FileDown className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[9px] text-amber-400/80 uppercase tracking-wider">
                  CREDENTIAL ARCHIVE
                </div>
                <div className="text-xs font-bold text-white">
                  [ DOWNLOAD RESUME ]
                </div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
              PDF
            </span>
          </a>
        </div>

        {/* Console Telemetry Footer */}
        <div className="relative pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              <span>EXPEDITION: 100% COMPLETE</span>
            </div>
            <span className="text-slate-700" aria-hidden="true">•</span>
            <span>BERTH: AMBER-05</span>
          </div>

          {/* Replay Mission Return Button */}
          {onReplayMission && (
            <button
              onClick={onReplayMission}
              aria-label="Return to Origin: Reset mission and replay flight from Sector 01 launchpad"
              className="hover:text-cyan-300 text-slate-400 transition-colors flex items-center space-x-1.5 uppercase tracking-wider cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>[ RETURN TO ORIGIN ]</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
