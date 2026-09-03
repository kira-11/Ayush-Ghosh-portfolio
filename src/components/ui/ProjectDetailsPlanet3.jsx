import React, { useState, useEffect, useRef } from 'react';
import { Brain, Activity, ExternalLink, X, ChevronRight, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/portfolioContent';

const PROJECT_ICONS = {
  'brain-tumor': Brain,
  'motion-tracking': Activity,
};

// Animated Radial Gauge Dial for AUC: 0.737
function AucRadialGauge({ value = 0.737 }) {
  const [currentScore, setCurrentScore] = useState(0);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - value);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1200; // 1.2s smooth fill

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrentScore(eased * value);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  const offset = circumference * (1 - currentScore);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/80 rounded-xl border border-cyan-500/30 shadow-inner">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          {/* Background Track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Glowing Animated Progress Bar */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-cyan-400 transition-all duration-75"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.7))',
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-base font-bold text-white tracking-tight text-glow-cyan">
            {currentScore.toFixed(3)}
          </span>
          <span className="font-mono text-[9px] text-cyan-300 uppercase tracking-widest">
            AUC ROC
          </span>
        </div>
      </div>

      <div className="mt-1 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
        Model Validation
      </div>
    </div>
  );
}

// Animated MediaPipe Skeleton Pose Visualization
function MediaPipeSkeletonVisual() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let animId;
    const animate = () => {
      setFrame((prev) => (prev + 0.05) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute animated joint coordinates simulating a natural walking/tracking loop
  const cx = 50;
  const cy = 48;
  const t = frame;

  // Head
  const headX = cx + Math.sin(t * 2) * 1.5;
  const headY = 16 + Math.cos(t * 2) * 1.2;

  // Neck & Shoulders
  const neckX = headX;
  const neckY = 24;
  const lShoulderX = neckX - 12;
  const lShoulderY = 26;
  const rShoulderX = neckX + 12;
  const rShoulderY = 26;

  // Arms (Swinging in opposition)
  const lElbowX = lShoulderX - 6 + Math.sin(t) * 7;
  const lElbowY = 38 + Math.cos(t) * 3;
  const lWristX = lElbowX - 4 + Math.sin(t + 0.5) * 8;
  const lWristY = 48 + Math.cos(t + 0.5) * 4;

  const rElbowX = rShoulderX + 6 - Math.sin(t) * 7;
  const rElbowY = 38 - Math.cos(t) * 3;
  const rWristX = rElbowX + 4 - Math.sin(t + 0.5) * 8;
  const rWristY = 48 - Math.cos(t + 0.5) * 4;

  // Spine & Hips
  const midSpineX = cx;
  const midSpineY = 44;
  const lHipX = midSpineX - 8;
  const lHipY = 54;
  const rHipX = midSpineX + 8;
  const rHipY = 54;

  // Legs (Natural stride motion)
  const lKneeX = lHipX - Math.sin(t) * 8;
  const lKneeY = 70 + Math.abs(Math.sin(t)) * 4;
  const lAnkleX = lKneeX - Math.sin(t + 0.3) * 6;
  const lAnkleY = 86 - Math.cos(t) * 3;

  const rKneeX = rHipX + Math.sin(t) * 8;
  const rKneeY = 70 + Math.abs(Math.cos(t)) * 4;
  const rAnkleX = rKneeX + Math.sin(t + 0.3) * 6;
  const rAnkleY = 86 + Math.cos(t) * 3;

  const joints = [
    [headX, headY],
    [neckX, neckY],
    [lShoulderX, lShoulderY],
    [rShoulderX, rShoulderY],
    [lElbowX, lElbowY],
    [rElbowX, rElbowY],
    [lWristX, lWristY],
    [rWristX, rWristY],
    [midSpineX, midSpineY],
    [lHipX, lHipY],
    [rHipX, rHipY],
    [lKneeX, lKneeY],
    [rKneeX, rKneeY],
    [lAnkleX, lAnkleY],
    [rAnkleX, rAnkleY],
  ];

  const bones = [
    // Head & Torso
    [[headX, headY], [neckX, neckY]],
    [[lShoulderX, lShoulderY], [rShoulderX, rShoulderY]],
    [[neckX, neckY], [midSpineX, midSpineY]],
    [[midSpineX, midSpineY], [lHipX, lHipY]],
    [[midSpineX, midSpineY], [rHipX, rHipY]],
    [[lHipX, lHipY], [rHipX, rHipY]],
    // Left Arm
    [[lShoulderX, lShoulderY], [lElbowX, lElbowY]],
    [[lElbowX, lElbowY], [lWristX, lWristY]],
    // Right Arm
    [[rShoulderX, rShoulderY], [rElbowX, rElbowY]],
    [[rElbowX, rElbowY], [rWristX, rWristY]],
    // Left Leg
    [[lHipX, lHipY], [lKneeX, lKneeY]],
    [[lKneeX, lKneeY], [lAnkleX, lAnkleY]],
    // Right Leg
    [[rHipX, rHipY], [rKneeX, rKneeY]],
    [[rKneeX, rKneeY], [rAnkleX, rAnkleY]],
  ];

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/80 rounded-xl border border-purple-500/30 shadow-inner">
      <div className="relative w-24 h-24 flex items-center justify-center bg-slate-950/60 rounded-lg overflow-hidden border border-purple-900/40">
        <svg viewBox="0 0 100 96" className="w-full h-full p-1">
          {/* Connecting Bones / Wireframe */}
          {bones.map(([p1, p2], idx) => (
            <line
              key={`bone-${idx}`}
              x1={p1[0]}
              y1={p1[1]}
              x2={p2[0]}
              y2={p2[1]}
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}

          {/* Glowing Joint Landmark Dots */}
          {joints.map(([x, y], idx) => (
            <circle
              key={`joint-${idx}`}
              cx={x}
              cy={y}
              r={idx === 0 ? 3.5 : 2.2}
              fill="#22d3ee"
              stroke="#a855f7"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }}
            />
          ))}
        </svg>

        {/* Live Tracking Status Tag */}
        <div className="absolute top-1 left-1.5 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[8px] text-emerald-300">LIVE POSE</span>
        </div>
      </div>

      <div className="mt-1 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
        33 Landmarks / 30 FPS
      </div>
    </div>
  );
}

export default function ProjectDetailsPlanet3({
  isVisible = true,
  selectedProject,
  onSelectProject,
}) {
  if (!isVisible) return null;

  const currentProject = selectedProject ? PROJECTS_DATA[selectedProject] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-8">
      {/* Top Banner: Project Switcher */}
      <div className="pointer-events-auto flex items-center justify-between mx-auto max-w-2xl w-full mt-16 sm:mt-20">
        <div className="flex items-center space-x-2 backdrop-blur-xl bg-slate-950/85 border border-slate-800/80 px-4 py-2 rounded-xl shadow-2xl text-xs font-mono text-slate-300">
          <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">PLANET 03 // RUST DUNES:</span>
          <span className="font-semibold text-white">SELECT PROJECT BEACON</span>
        </div>

        {/* Quick Project Switcher Buttons */}
        <div className="flex items-center space-x-2" role="group" aria-label="Project Beacons">
          <button
            onClick={() => onSelectProject(selectedProject === 'brain-tumor' ? null : 'brain-tumor')}
            aria-label="Toggle Project: Deep Learning Brain Tumor MRI Multi-Class Classification"
            aria-pressed={selectedProject === 'brain-tumor'}
            className={`pointer-events-auto px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
              selectedProject === 'brain-tumor'
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50'
            }`}
          >
            <Brain className="w-3 h-3 text-cyan-400" />
            <span>BRAIN TUMOR AI</span>
          </button>

          <button
            onClick={() => onSelectProject(selectedProject === 'motion-tracking' ? null : 'motion-tracking')}
            aria-label="Toggle Project: Real-Time Human Pose Tracking with MediaPipe & OpenCV"
            aria-pressed={selectedProject === 'motion-tracking'}
            className={`pointer-events-auto px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer ${
              selectedProject === 'motion-tracking'
                ? 'bg-purple-950/90 border-purple-400 text-purple-300 shadow-lg shadow-purple-950'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/50'
            }`}
          >
            <Activity className="w-3 h-3 text-purple-400" />
            <span>POSE TRACKING</span>
          </button>
        </div>
      </div>

      {/* Main Project Detail Card (Opens when a project is selected) */}
      {currentProject && (
        <aside
          aria-label="Project Detail Card"
          className="pointer-events-auto mx-auto max-w-xl w-full my-auto transition-all duration-500 ease-out animate-fadeIn"
        >
          <div className="relative rounded-xl backdrop-blur-xl bg-slate-950/90 border border-cyan-500/40 p-5 md:p-6 shadow-[0_0_50px_rgba(6,182,212,0.18)] panel-edge-flicker overflow-hidden text-slate-100">
            {/* CRT Scanline Texture */}
            <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />

            {/* Reticle Corner Brackets */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

            {/* Header Ribbon */}
            <div className="relative flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`p-1.5 rounded-lg border ${
                    currentProject.themeColor === 'cyan'
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                      : 'bg-purple-950/60 border-purple-500/50 text-purple-400'
                  }`}
                >
                  {(() => {
                    const ProjectIcon = PROJECT_ICONS[currentProject.id] || Brain;
                    return <ProjectIcon className="w-4 h-4" aria-hidden="true" />;
                  })()}
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase font-bold text-glow-cyan">
                    {currentProject.tag}
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-white tracking-wide leading-tight">
                    {currentProject.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                  {currentProject.dates}
                </span>
                <button
                  onClick={() => onSelectProject(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body: Description + Interactive Visual Display (Dial or Skeleton) */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
              {/* Left Column: Description & Metadata */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-cyan-300 sm:hidden">
                  <span>TIMEFRAME: {currentProject.dates}</span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-500/50 pl-3">
                  {currentProject.description}
                </p>
              </div>

              {/* Right Column: Custom Visual Display (Radial Gauge or Skeleton Visual) */}
              <div className="shrink-0">
                {currentProject.visualType === 'gauge' ? (
                  <AucRadialGauge value={0.737} />
                ) : (
                  <MediaPipeSkeletonVisual />
                )}
              </div>
            </div>

            {/* Tech Stack Tags (Small Pill Badges) */}
            <div className="relative pt-3 border-t border-slate-800/80">
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">
                Core Technologies:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentProject.techTags.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] shadow-sm hover:border-cyan-400 transition-colors"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action Links: GitHub Repo */}
            <div className="relative mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>BENCHMARK: VALIDATED</span>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${currentProject.title} repository source code on GitHub (opens in new tab)`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-mono tracking-wider transition-all duration-200 shadow-md hover:shadow-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>[ VIEW ON GITHUB ]</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                </a>

                <button
                  onClick={() => onSelectProject(null)}
                  aria-label="Close Project Inspection Panel"
                  className="text-slate-400 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Bottom Guidance Hint */}
      {!currentProject && (
        <div className="pointer-events-none mx-auto mb-16 text-center">
          <div className="inline-flex items-center space-x-2 backdrop-blur-md bg-slate-900/70 border border-slate-800/80 px-4 py-2 rounded-xl text-xs font-mono text-cyan-300 animate-pulse">
            <span>CLICK A PROJECT BEACON ON THE SURFACE OR IN THE TOP BAR TO INSPECT</span>
          </div>
        </div>
      )}
    </div>
  );
}
