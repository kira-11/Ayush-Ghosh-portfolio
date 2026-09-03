import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import gsap from 'gsap';
import Scene from './components/canvas/Scene';
import HudOverlay from './components/ui/HudOverlay';
import PilotsDossier from './components/ui/PilotsDossier';
import FlightNavDots from './components/ui/FlightNavDots';
import LaunchCountdownLoader from './components/ui/LaunchCountdownLoader';
import { PLANETS } from './data/planetsData';

// Lazy-load UI panels below the fold
const MissionLogsPlanet2 = lazy(() => import('./components/ui/MissionLogsPlanet2'));
const ProjectDetailsPlanet3 = lazy(() => import('./components/ui/ProjectDetailsPlanet3'));
const SkillsOverlayPlanet4 = lazy(() => import('./components/ui/SkillsOverlayPlanet4'));
const DockingStationPlanet5 = lazy(() => import('./components/ui/DockingStationPlanet5'));
const ReducedMotionPortfolio = lazy(() => import('./components/ui/ReducedMotionPortfolio'));

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransmissionTyping, setIsTransmissionTyping] = useState(false);
  const [selectedOutpost, setSelectedOutpost] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredSkillNode, setHoveredSkillNode] = useState(null);
  const [activeClusterId, setActiveClusterId] = useState(null);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const scrollTweenRef = useRef(null);

  // Reduced motion media query detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Manual user override to switch between 3D flight and static reduced-motion
  const [reducedMotionOverride, setReducedMotionOverride] = useState(null);
  const isReducedMotion =
    reducedMotionOverride !== null ? reducedMotionOverride : prefersReducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const [telemetry, setTelemetry] = useState({
    planetName: PLANETS[0].name,
    sectionName: PLANETS[0].section,
    planetCode: PLANETS[0].code,
    flightState: 'IDLE',
    planetIndex: 0,
    progress: 0,
    altitude: 0,
  });

  // Track window scroll progress [0, 1]
  useEffect(() => {
    if (isReducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const p = Math.max(0, Math.min(1, scrollY / maxScroll));
        setScrollProgress(p);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReducedMotion]);

  // Programmatic jump to a specific planet with smooth GSAP flight animation
  const handleJumpToPlanet = useCallback((index) => {
    const stationProgresses = [0.04, 0.29, 0.54, 0.79, 0.98];
    const targetP = stationProgresses[index] ?? 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const targetScroll = targetP * maxScroll;
    const currentScroll = window.scrollY;
    const distance = Math.abs(targetScroll - currentScroll);
    // Smooth cinematic travel duration scaled with flight distance (1.2s to 2.8s)
    const duration = Math.min(2.8, Math.max(1.2, (distance / maxScroll) * 3.2));

    // Kill any active flight scroll tween
    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }

    const scrollObj = { y: currentScroll };
    scrollTweenRef.current = gsap.to(scrollObj, {
      y: targetScroll,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
    });
  }, []);

  // Callback for hovering a 3D constellation node
  const handleHoverSkillNode = useCallback((id, category, label) => {
    if (!id) {
      setHoveredSkillNode(null);
    } else {
      setHoveredSkillNode({ id, category, label });
    }
  }, []);

  // Visibility conditions for each planet milestone
  const isAtPlanetOne =
    telemetry.planetIndex === 0 &&
    (telemetry.flightState === 'IDLE' || telemetry.flightState === 'TOUCHDOWN' || scrollProgress <= 0.08);

  const isAtPlanetTwo =
    telemetry.planetIndex === 1 &&
    (telemetry.flightState === 'IDLE' || telemetry.flightState === 'TOUCHDOWN' || (scrollProgress >= 0.22 && scrollProgress <= 0.38));

  const isAtPlanetThree =
    telemetry.planetIndex === 2 &&
    (telemetry.flightState === 'IDLE' || telemetry.flightState === 'TOUCHDOWN' || (scrollProgress >= 0.46 && scrollProgress <= 0.62));

  const isAtPlanetFour =
    telemetry.planetIndex === 3 &&
    (telemetry.flightState === 'IDLE' || telemetry.flightState === 'TOUCHDOWN' || (scrollProgress >= 0.70 && scrollProgress <= 0.86));

  const isAtPlanetFive =
    telemetry.planetIndex === 4 &&
    (telemetry.flightState === 'IDLE' || telemetry.flightState === 'TOUCHDOWN' || scrollProgress >= 0.88);

  // Reset states when moving away from respective planets
  useEffect(() => {
    if (!isAtPlanetTwo) setSelectedOutpost(null);
  }, [isAtPlanetTwo]);

  useEffect(() => {
    if (!isAtPlanetThree) setSelectedProject(null);
  }, [isAtPlanetThree]);

  useEffect(() => {
    if (!isAtPlanetFour) {
      setHoveredSkillNode(null);
      setActiveClusterId(null);
    }
  }, [isAtPlanetFour]);

  // If reduced-motion is requested or toggled, render the static accessible portfolio
  if (isReducedMotion) {
    return (
      <Suspense fallback={null}>
        <ReducedMotionPortfolio
          onToggle3DMode={() => setReducedMotionOverride(false)}
        />
      </Suspense>
    );
  }

  return (
    <div className="relative w-full bg-[#080d1a]">
      {/* Systems Check / Launch Countdown Loading Screen */}
      {!isLoaderFinished && (
        <LaunchCountdownLoader onFinished={() => setIsLoaderFinished(true)} />
      )}

      {/* Fixed Fullscreen 3D Viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Scene
          scrollProgress={scrollProgress}
          onTelemetryUpdate={setTelemetry}
          isTransmissionTyping={isTransmissionTyping}
          selectedOutpost={selectedOutpost}
          onSelectOutpost={setSelectedOutpost}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          hoveredSkillNodeId={hoveredSkillNode?.id}
          onHoverSkillNode={handleHoverSkillNode}
          activeClusterId={activeClusterId}
        />
      </div>

      {/* Persistent Minimal Edge Navigation (Right Rail Dots) */}
      <FlightNavDots
        activePlanetIndex={telemetry.planetIndex}
        scrollProgress={scrollProgress}
        onJumpToPlanet={handleJumpToPlanet}
      />

      {/* Floating HUD Telemetry Overlay */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        <HudOverlay
          telemetry={telemetry}
          onJumpToPlanet={handleJumpToPlanet}
          onToggleReducedMotion={() => setReducedMotionOverride(true)}
        />

        {/* Planet 1 Content: Pilot's Dossier / Incoming Transmission (Above the fold - loaded immediately) */}
        <PilotsDossier
          isVisible={isAtPlanetOne}
          onTypingChange={setIsTransmissionTyping}
        />

        {/* Below-the-fold UI Panels - Lazy loaded on demand */}
        <Suspense fallback={null}>
          {/* Planet 2 Content: Mission Logs across Outposts A & B */}
          {isAtPlanetTwo && (
            <MissionLogsPlanet2
              isVisible={isAtPlanetTwo}
              selectedOutpost={selectedOutpost}
              onSelectOutpost={setSelectedOutpost}
              onTypingChange={setIsTransmissionTyping}
            />
          )}

          {/* Planet 3 Content: Project Details across Landmarks 1 & 2 */}
          {isAtPlanetThree && (
            <ProjectDetailsPlanet3
              isVisible={isAtPlanetThree}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
            />
          )}

          {/* Planet 4 Content: Skills Constellation Overlay */}
          {isAtPlanetFour && (
            <SkillsOverlayPlanet4
              isVisible={isAtPlanetFour}
              hoveredNodeInfo={hoveredSkillNode}
              activeClusterId={activeClusterId}
              onSelectCluster={setActiveClusterId}
              onScanNode={handleHoverSkillNode}
            />
          )}

          {/* Planet 5 Content: Final Docking Station Control Panel */}
          {isAtPlanetFive && (
            <DockingStationPlanet5
              isVisible={isAtPlanetFive}
              onReplayMission={() => handleJumpToPlanet(0)}
            />
          )}
        </Suspense>
      </div>

      {/* Virtual Scroll Corridor (650vh height ensures smooth, cinematic pacing across 5 planets) */}
      <div className="w-full h-[650vh] pointer-events-none relative" />
    </div>
  );
}
