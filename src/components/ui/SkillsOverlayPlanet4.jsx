import React from 'react';
import { Sparkles, Network, CheckCircle2, Radar } from 'lucide-react';
import { SKILL_CLUSTERS } from '../../data/portfolioContent';

export default function SkillsOverlayPlanet4({
  isVisible = true,
  hoveredNodeInfo,
  activeClusterId,
  onSelectCluster,
  onScanNode,
}) {
  if (!isVisible) return null;

  // Shortened user-friendly display labels for pills
  const CLUSTER_SHORT_LABELS = {
    languages: 'Languages',
    mldl: 'ML / DL',
    datascience: 'Data Science',
    cloud: 'Cloud & Infra',
    devops: 'DevOps & Tools',
  };

  // Get active nodes for screen readers and keyboard navigation
  const visibleClusters = activeClusterId
    ? SKILL_CLUSTERS.filter((c) => c.id === activeClusterId)
    : SKILL_CLUSTERS;

  const activeNodes = visibleClusters.flatMap((c) =>
    c.nodes.map((n) => ({ ...n, clusterName: c.name, clusterColor: c.color }))
  );

  return (
    <aside
      aria-label="Skills Constellation Sidebar"
      className="pointer-events-none fixed inset-0 z-20 flex select-none"
    >
      {/* Left Sidebar Panel: Merged, Spacious, Non-Central Container */}
      <div className="pointer-events-auto fixed left-4 sm:left-8 md:left-12 top-24 sm:top-28 md:top-32 w-80 sm:w-88 md:w-96 max-w-[calc(100vw-2rem)] transition-all duration-500 ease-out animate-fadeIn">
        <div className="relative rounded-2xl backdrop-blur-xl bg-slate-950/85 border border-cyan-500/30 p-5 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.12)] panel-edge-flicker overflow-hidden text-slate-100">
          {/* Subtle CRT Scanline Overlay */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-30" />

          {/* Futuristic Corner Reticle Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />

          {/* Console Header */}
          <div className="relative border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Network className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold text-glow-cyan">
                COBALT SPIRES // SKILLS CONSTELLATION
              </span>
            </div>
            <p className="font-mono text-[10px] text-slate-400 mt-1">
              24 CELESTIAL NODES • 5 SPECIALIZATIONS
            </p>
          </div>

          {/* Cluster Filter Section (Clean Multi-Row Wrapped Pills, No Scrollbars) */}
          <div className="relative mb-4">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              Filter By Cluster:
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Skill Clusters">
              {/* All Clusters Pill */}
              <button
                onClick={() => onSelectCluster(null)}
                aria-label="Filter: Show all skill clusters"
                aria-pressed={!activeClusterId}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  !activeClusterId
                    ? 'bg-slate-800 text-white border-cyan-500/50 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                All Clusters
              </button>

              {/* Categorized Cluster Pills */}
              {SKILL_CLUSTERS.map((cluster) => {
                const isActive = activeClusterId === cluster.id;
                const shortLabel = CLUSTER_SHORT_LABELS[cluster.id] || cluster.name;

                return (
                  <button
                    key={cluster.id}
                    onClick={() =>
                      onSelectCluster(isActive ? null : cluster.id)
                    }
                    aria-label={`Filter: ${cluster.name} (${cluster.nodes.length} nodes)`}
                    aria-pressed={isActive}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all duration-200 flex items-center space-x-1.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                      isActive
                        ? `${cluster.badgeBg} ${cluster.badgeBorder} ${cluster.badgeText} shadow-md shadow-cyan-950/40 scale-102`
                        : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cluster.color }}
                      aria-hidden="true"
                    />
                    <span>{shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accessible Constellation Nodes List for Screen Readers & Keyboard Navigation */}
          <div className="relative mb-4">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              Constellation Nodes ({activeNodes.length}):
            </div>
            <div
              className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1"
              role="group"
              aria-label="Celestial Skill Nodes"
            >
              {activeNodes.map((node) => {
                const isNodeActive = hoveredNodeInfo?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => onScanNode && onScanNode(node.id, node.clusterName, node.label)}
                    onFocus={() => onScanNode && onScanNode(node.id, node.clusterName, node.label)}
                    aria-label={`Inspect skill node: ${node.label} in ${node.clusterName}`}
                    aria-pressed={isNodeActive}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                      isNodeActive
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Integrated Live Telemetry Scan Card (Built into Sidebar, Leaving Center View 100% Clear) */}
          <div className="relative pt-4 border-t border-slate-800/80">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
              Node Telemetry Feed:
            </div>

            {hoveredNodeInfo ? (
              <div className="bg-slate-900/70 border border-cyan-400/40 p-3 rounded-xl shadow-inner flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
                  </span>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-cyan-400">
                      {hoveredNodeInfo.category}
                    </div>
                    <div className="font-mono text-sm font-bold text-white tracking-wide">
                      {hoveredNodeInfo.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-emerald-400 font-mono text-[10px] shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SCANNED</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800/70 p-3 rounded-xl flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                <Radar className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Hover or tap any 3D node in the sky to scan telemetry</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
