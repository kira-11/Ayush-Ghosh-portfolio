import React, { useMemo, Suspense, lazy, useState, useEffect } from 'react';
import * as THREE from 'three';
import Planet from './Planet';
import { PLANETS } from '../../data/planetsData';

// Lazy-load 3D models and landmark systems for planets below the fold
const OutpostLandmarks = lazy(() => import('./OutpostLandmarks'));
const ProjectLandmarks = lazy(() => import('./ProjectLandmarks'));
const SkillsConstellation = lazy(() => import('./SkillsConstellation'));
const DockingStation = lazy(() => import('./DockingStation'));

export default function PlanetsSystem({
  flightSpline,
  currentPlanetIndex = 0,
  scrollProgress = 0,
  selectedOutpost,
  onSelectOutpost,
  selectedProject,
  onSelectProject,
  hoveredSkillNodeId,
  onHoverSkillNode,
  activeClusterId,
  isDocked = false,
}) {
  // Track which planets have been unlocked for progressive lazy-loading
  // On initial page load at Planet 0 (first view), only Planet 0 is loaded.
  const [loadedPlanets, setLoadedPlanets] = useState(() => new Set([0]));

  useEffect(() => {
    setLoadedPlanets((prev) => {
      const next = new Set(prev);
      let changed = false;

      // Unlock Planet 1 (Planet 2: Basalt Reach & Outposts) when flight begins
      if (!next.has(1) && (scrollProgress >= 0.04 || currentPlanetIndex >= 1)) {
        next.add(1);
        changed = true;
      }
      // Unlock Planet 2 (Planet 3: Rust Dunes & Projects) when approaching sector 3
      if (!next.has(2) && (scrollProgress >= 0.24 || currentPlanetIndex >= 2)) {
        next.add(2);
        changed = true;
      }
      // Unlock Planet 3 (Planet 4: Cobalt Spires & Skills Constellation) when approaching sector 4
      if (!next.has(3) && (scrollProgress >= 0.48 || currentPlanetIndex >= 3)) {
        next.add(3);
        changed = true;
      }
      // Unlock Planet 4 (Planet 5: Amber Sanctum & Docking Cradle) when approaching sector 5
      if (!next.has(4) && (scrollProgress >= 0.72 || currentPlanetIndex >= 4)) {
        next.add(4);
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [scrollProgress, currentPlanetIndex]);

  // Generate curved trajectory line points
  const splineLineGeometry = useMemo(() => {
    if (!flightSpline) return null;
    const points = flightSpline.getPoints(200);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [flightSpline]);

  return (
    <group>
      {/* 5 Planetary Bodies: Planet 0 loaded initially, below-the-fold planets lazy-loaded on demand */}
      {PLANETS.map((planet, idx) => {
        // Planet 0 always renders; Planets 1-4 only render once user scrolls/approaches
        if (!loadedPlanets.has(idx)) return null;
        return <Planet key={planet.id} data={planet} />;
      })}

      <Suspense fallback={null}>
        {/* Surface Outpost Landmarks on Planet 2 (Basalt Reach) - Lazy loaded */}
        {loadedPlanets.has(1) && (
          <OutpostLandmarks
            selectedOutpost={selectedOutpost}
            onSelectOutpost={onSelectOutpost}
          />
        )}

        {/* Surface Project Landmarks on Planet 3 (Rust Dunes) - Lazy loaded */}
        {loadedPlanets.has(2) && (
          <ProjectLandmarks
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
          />
        )}

        {/* Skills Constellation on Planet 4 (Cobalt Spires) - Lazy loaded */}
        {loadedPlanets.has(3) && (
          <SkillsConstellation
            hoveredNodeId={hoveredSkillNodeId}
            onHoverNode={onHoverSkillNode}
            activeClusterId={activeClusterId}
          />
        )}

        {/* Final Docking Station Cradle on Planet 5 (Amber Sanctum) - Lazy loaded */}
        {loadedPlanets.has(4) && <DockingStation isDocked={isDocked} />}
      </Suspense>

      {/* Subtle Glowing Orbit / Trajectory Path Guide */}
      {splineLineGeometry && (
        <line geometry={splineLineGeometry}>
          <lineDashedMaterial
            color="#38bdf8"
            dashSize={1.2}
            gapSize={0.8}
            transparent
            opacity={0.18}
            linewidth={1}
          />
        </line>
      )}
    </group>
  );
}
