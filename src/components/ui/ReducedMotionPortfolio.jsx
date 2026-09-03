import React, { useState } from 'react';
import {
  Rocket,
  Mail,
  Github,
  Linkedin,
  FileDown,
  ExternalLink,
  ChevronDown,
  Brain,
  Activity,
  Cloud,
  Terminal,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  PILOT_PROFILE,
  OUTPOST_DATA,
  PROJECTS_DATA,
  SKILL_CLUSTERS,
  CONTACT_DATA,
} from '../../data/portfolioContent';

const OUTPOST_ICONS = {
  A: Cloud,
  B: Terminal,
};

const PROJECT_ICONS = {
  'brain-tumor': Brain,
  'motion-tracking': Activity,
};

export default function ReducedMotionPortfolio({ onToggle3DMode }) {
  const [showFullDossier, setShowFullDossier] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#080d1a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Subtle CRT Scanlines & Ambient Radial Glows */}
      <div className="fixed inset-0 crt-scanlines pointer-events-none opacity-25 z-0" />
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      {/* Persistent Accessible Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase font-bold">
                PORTFOLIO // STATIC ACCESSIBILITY MODE
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {PILOT_PROFILE.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav aria-label="Sections" className="hidden md:flex items-center space-x-4 font-mono text-xs text-slate-400">
              <a href="#about" aria-label="Jump to Section 01: About Me" className="hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1">01. About</a>
              <a href="#experience" aria-label="Jump to Section 02: Work Experience" className="hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1">02. Experience</a>
              <a href="#projects" aria-label="Jump to Section 03: Projects" className="hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1">03. Projects</a>
              <a href="#skills" aria-label="Jump to Section 04: Technical Skills" className="hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1">04. Skills</a>
              <a href="#contact" aria-label="Jump to Section 05: Contact & Credentials" className="hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1">05. Contact</a>
            </nav>

            {/* Manual Toggle to switch back to 3D flight mode */}
            {onToggle3DMode && (
              <button
                onClick={onToggle3DMode}
                aria-label="Switch back to interactive 3D WebGL flight mode"
                className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/50 text-cyan-300 hover:text-white font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Rocket className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span className="hidden sm:inline">SWITCH TO 3D FLIGHT</span>
                <span className="sm:hidden">3D MODE</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-24">
        {/* ========================================================= */}
        {/* SECTION 1: ABOUT // PILOT'S DOSSIER                       */}
        {/* ========================================================= */}
        <section id="about" className="scroll-mt-20">
          <div className="rounded-2xl backdrop-blur-xl bg-slate-950/85 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl panel-edge-flicker relative">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            <div className="font-mono text-xs text-cyan-400 space-y-1 mb-4">
              <div>&gt; INCOMING TRANSMISSION...</div>
              <div>&gt; PILOT ID: <strong className="text-white">{PILOT_PROFILE.name}</strong></div>
              <div>&gt; SPECIALIZATION: <strong className="text-cyan-300">{PILOT_PROFILE.role}</strong></div>
              <div>&gt; STATUS: <strong className="text-emerald-400">{PILOT_PROFILE.status}</strong></div>
            </div>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans mb-6 border-l-2 border-cyan-500/50 pl-4">
              {PILOT_PROFILE.bio}
            </p>

            {/* Quick Skill Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {PILOT_PROFILE.skillTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Expandable Full Dossier Toggle */}
            <button
              onClick={() => setShowFullDossier(!showFullDossier)}
              aria-expanded={showFullDossier}
              aria-controls="reduced-motion-dossier"
              className="px-4 py-2 rounded-xl bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 hover:text-white font-mono text-xs tracking-wider flex items-center space-x-2 transition-all cursor-pointer mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>{showFullDossier ? '[ HIDE DOSSIER ]' : '[ VIEW FULL DOSSIER ]'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullDossier ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {showFullDossier && (
              <div id="reduced-motion-dossier" className="mt-4 pt-4 border-t border-slate-800 space-y-3 font-mono text-xs text-slate-300 animate-fadeIn">
                {PILOT_PROFILE.education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                    <div className="text-cyan-400 font-bold uppercase">{edu.degree}</div>
                    {edu.specialization && (
                      <div className="text-white font-sans mt-0.5">{edu.specialization}</div>
                    )}
                    <div className="text-slate-400 text-[11px] mt-0.5">{edu.institution} ({edu.period})</div>
                  </div>
                ))}

                {PILOT_PROFILE.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                    <div className="text-cyan-400 font-bold uppercase">CERTIFICATION:</div>
                    <div className="text-white font-sans mt-0.5">{cert.name}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: EXPERIENCE // MISSION LOGS                    */}
        {/* ========================================================= */}
        <section id="experience" className="scroll-mt-20">
          <div className="mb-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">SECTOR 02 // BASALT REACH</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Professional Mission Logs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(OUTPOST_DATA).map((outpost) => {
              const IconComp = OUTPOST_ICONS[outpost.id] || Cloud;
              const isCyan = outpost.themeColor === 'cyan';

              return (
                <div
                  key={outpost.id}
                  className={`rounded-2xl backdrop-blur-xl bg-slate-950/85 border ${
                    isCyan ? 'border-cyan-500/30' : 'border-purple-500/30'
                  } p-6 shadow-xl relative`}
                >
                  <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3 mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isCyan
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-400'
                          : 'bg-purple-950/60 border border-purple-500/40 text-purple-400'
                      }`}
                    >
                      <IconComp className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div
                        className={`font-mono text-[10px] uppercase font-bold ${
                          isCyan ? 'text-cyan-400' : 'text-purple-400'
                        }`}
                      >
                        {outpost.code} // {outpost.name.toUpperCase()}
                      </div>
                      <h3 className="font-bold text-base text-white">{outpost.role}</h3>
                      <div className="font-mono text-[11px] text-slate-400">{outpost.period}</div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 font-sans">
                    {outpost.logs.map((log, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/60">
                        <strong className={`font-mono ${isCyan ? 'text-cyan-300' : 'text-purple-300'}`}>
                          [LOG 0{idx + 1}]
                        </strong>{' '}
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: PROJECTS // RESEARCH & COMPUTER VISION        */}
        {/* ========================================================= */}
        <section id="projects" className="scroll-mt-20">
          <div className="mb-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">SECTOR 03 // RUST DUNES</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Featured AI / ML Projects</h2>
          </div>

          <div className="space-y-6">
            {Object.values(PROJECTS_DATA).map((project) => {
              const IconComp = PROJECT_ICONS[project.id] || Brain;
              const isCyan = project.themeColor === 'cyan';

              return (
                <div
                  key={project.id}
                  className={`rounded-2xl backdrop-blur-xl bg-slate-950/85 border ${
                    isCyan ? 'border-cyan-500/30' : 'border-purple-500/30'
                  } p-6 shadow-xl relative`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center space-x-2.5">
                      <IconComp className={`w-5 h-5 ${isCyan ? 'text-cyan-400' : 'text-purple-400'}`} aria-hidden="true" />
                      <div>
                        <span
                          className={`font-mono text-[10px] font-bold uppercase ${
                            isCyan ? 'text-cyan-400' : 'text-purple-400'
                          }`}
                        >
                          {project.tag}
                        </span>
                        <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate-400">{project.dates}</span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techTags.map((t) => (
                        <span
                          key={t}
                          className={`px-2.5 py-0.5 rounded-full ${
                            isCyan
                              ? 'bg-cyan-950/50 border border-cyan-500/30 text-cyan-300'
                              : 'bg-purple-950/50 border border-purple-500/30 text-purple-300'
                          } font-mono text-[10px]`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                        {project.metricScore}
                      </span>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} project source code on GitHub (opens in new tab)`}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg ${
                          isCyan
                            ? 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-300 hover:text-white'
                            : 'bg-purple-950/60 border border-purple-400/50 text-purple-300 hover:text-white'
                        } text-xs font-mono focus:outline-none focus-visible:ring-2 ${
                          isCyan ? 'focus-visible:ring-cyan-400' : 'focus-visible:ring-purple-400'
                        }`}
                      >
                        <span>GITHUB</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: SKILLS // CATEGORIZED CONSTELLATION           */}
        {/* ========================================================= */}
        <section id="skills" className="scroll-mt-20">
          <div className="mb-4">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">SECTOR 04 // COBALT SPIRES</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Technical Competencies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILL_CLUSTERS.map((cluster) => (
              <div
                key={cluster.id}
                className="rounded-2xl backdrop-blur-xl bg-slate-950/80 border border-slate-800 p-5 shadow-xl hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cluster.color }} aria-hidden="true" />
                  <h3 className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                    {cluster.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cluster.nodes.map((node) => (
                    <span
                      key={node.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-[11px]"
                    >
                      {node.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: CONTACT // DOCKING STATION CONSOLE            */}
        {/* ========================================================= */}
        <section id="contact" className="scroll-mt-20 pb-16">
          <div className="rounded-2xl backdrop-blur-xl bg-slate-950/90 border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center space-x-2 text-amber-400 mb-2">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold">
                SECTOR 05 // DOCKING CONSOLE
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-wide mb-2">
              {CONTACT_DATA.headline}
            </h2>
            <p className="text-sm text-slate-300 font-sans mb-6">
              {CONTACT_DATA.message}
            </p>

            <div className="space-y-3">
              <a
                href={`mailto:${CONTACT_DATA.email}?subject=${encodeURIComponent(CONTACT_DATA.emailSubject)}`}
                aria-label={`Transmit email to ${PILOT_PROFILE.name} at ${CONTACT_DATA.email}`}
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-400/50 text-white font-mono text-xs tracking-wider transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <span className="font-bold">[ TRANSMIT EMAIL ]</span>
                </div>
                <span className="text-cyan-300 text-xs" aria-hidden="true">{CONTACT_DATA.email} ↗</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Social Links & Resume">
                <a
                  href={CONTACT_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${PILOT_PROFILE.name}'s LinkedIn crew profile (opens in new tab)`}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700 text-white font-mono text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-slate-300" aria-hidden="true" />
                    <span>[ CREW PROFILE ]</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </a>

                <a
                  href={CONTACT_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source repositories on GitHub (opens in new tab)"
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700 text-white font-mono text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-slate-300" aria-hidden="true" />
                    <span>[ VIEW SOURCE LOG ]</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </a>

                <a
                  href={CONTACT_DATA.resumePath}
                  download={CONTACT_DATA.resumeFilename}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download ${PILOT_PROFILE.name}'s Resume (PDF document)`}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-amber-500/40 text-white font-mono text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div className="flex items-center space-x-2">
                    <FileDown className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <span>[ DOWNLOAD RESUME ]</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                    PDF
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Accessible Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center font-mono text-xs text-slate-500">
        <p>{PILOT_PROFILE.name} • 3D Interactive Portfolio • Reduced Motion Fallback Mode</p>
      </footer>
    </div>
  );
}
