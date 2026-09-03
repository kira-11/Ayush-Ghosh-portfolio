import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Rocket from './Rocket';
import PlanetsSystem from './PlanetsSystem';
import SpaceEnvironment from './SpaceEnvironment';
import Lighting from './Lighting';
import { useFlightController } from '../../hooks/useFlightController';
import { useDevicePerformance } from '../../hooks/useDevicePerformance';
import { PLANETS } from '../../data/planetsData';

// Component running inside R3F Canvas to sync camera OrbitControls with rocket flight spline
function FlightManager({
  targetScrollProgress,
  onTelemetryUpdate,
  isTransmissionTyping,
  selectedOutpost,
  onSelectOutpost,
  selectedProject,
  onSelectProject,
  hoveredSkillNodeId,
  onHoverSkillNode,
  activeClusterId,
  isMobile = false,
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const smoothedScrollRef = useRef(0);
  const prevTargetRef = useRef(new THREE.Vector3(0, 1.8, 0));
  const { flightSpline, evaluateFlight } = useFlightController(targetScrollProgress);

  const [flightData, setFlightData] = useState({
    rocketPos: [0, 0, 0],
    rocketQuat: new THREE.Quaternion(),
    flightState: 'IDLE',
    currentPlanetIndex: 0,
    touchdownTrigger: 0,
  });

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Smooth momentum easing on the scroll progress
    smoothedScrollRef.current = THREE.MathUtils.damp(
      smoothedScrollRef.current,
      targetScrollProgress,
      4.5,
      delta
    );

    // Evaluate flight dynamics for current smoothed progress
    const evalResult = evaluateFlight(smoothedScrollRef.current, delta, time);

    const rocketPos = evalResult.rocketPos;
    const currentTarget = new THREE.Vector3(rocketPos.x, rocketPos.y + 1.8, rocketPos.z);

    if (controlsRef.current) {
      // Delta translation of the target along the 3D flight path
      const deltaTarget = new THREE.Vector3().subVectors(currentTarget, prevTargetRef.current);

      // Move camera in lockstep with the target's displacement along the curve
      camera.position.add(deltaTarget);

      // Update OrbitControls target to remain centered on the rocket
      controlsRef.current.target.copy(currentTarget);
      prevTargetRef.current.copy(currentTarget);

      // Touchdown Camera Shake
      if (evalResult.shakeIntensity > 0) {
        const amp = evalResult.shakeIntensity * 0.2;
        camera.position.x += Math.sin(time * 45) * amp;
        camera.position.y += Math.cos(time * 50) * amp;
        camera.position.z += Math.sin(time * 38) * amp * 0.7;
      }

      controlsRef.current.update();
    }

    // Update rocket model and lights state
    setFlightData({
      rocketPos: [evalResult.rocketPos.x, evalResult.rocketPos.y, evalResult.rocketPos.z],
      rocketQuat: evalResult.rocketQuat,
      flightState: evalResult.flightState,
      currentPlanetIndex: evalResult.currentPlanetIndex,
      touchdownTrigger: evalResult.touchdownTrigger,
    });

    // Notify HUD overlay of live telemetry
    if (onTelemetryUpdate) {
      const activePlanet = PLANETS[evalResult.currentPlanetIndex] || PLANETS[0];
      onTelemetryUpdate({
        planetName: activePlanet.name,
        sectionName: activePlanet.section,
        planetCode: activePlanet.code,
        flightState: evalResult.flightState,
        planetIndex: evalResult.currentPlanetIndex,
        progress: smoothedScrollRef.current,
        altitude: Math.max(0, evalResult.rocketPos.y - activePlanet.landingPad[1]),
      });
    }
  });

    // Check if settled at final destination docking bay
    const isDocked =
      flightData.currentPlanetIndex === 4 &&
      (flightData.flightState === 'IDLE' || flightData.flightState === 'TOUCHDOWN');

    return (
      <>
        {/* OrbitControls: enables free pointer/touch drag rotation around rocket, wheel zoom EXPLICITLY DISABLED */}
        <OrbitControls
          ref={controlsRef}
          enableRotate={true}
          enableZoom={false} // Wheel zoom disabled so scroll drives flight path
          enablePan={false}
          dampingFactor={0.08}
          enableDamping={true}
          minDistance={5}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 + 0.05} // Prevent camera going below terrain
        />

        <Lighting
          rocketPosition={flightData.rocketPos}
          flightState={flightData.flightState}
          isMobile={isMobile}
        />
        <SpaceEnvironment isMobile={isMobile} />
        <PlanetsSystem
          flightSpline={flightSpline}
          currentPlanetIndex={flightData.currentPlanetIndex}
          scrollProgress={smoothedScrollRef.current}
          selectedOutpost={selectedOutpost}
          onSelectOutpost={onSelectOutpost}
          selectedProject={selectedProject}
          onSelectProject={onSelectProject}
          hoveredSkillNodeId={hoveredSkillNodeId}
          onHoverSkillNode={onHoverSkillNode}
          activeClusterId={activeClusterId}
          isDocked={isDocked}
        />
        <Rocket
          position={flightData.rocketPos}
          quaternion={flightData.rocketQuat}
          flightState={flightData.flightState}
          touchdownTrigger={flightData.touchdownTrigger}
          isTransmissionTyping={isTransmissionTyping}
          isDocked={isDocked}
          isMobile={isMobile}
        />
      </>
    );
  }

export default function Scene({
  scrollProgress = 0,
  onTelemetryUpdate,
  isTransmissionTyping = false,
  selectedOutpost,
  onSelectOutpost,
  selectedProject,
  onSelectProject,
  hoveredSkillNodeId,
  onHoverSkillNode,
  activeClusterId,
}) {
  const { isMobile, dpr, enableShadows, antialias } = useDevicePerformance();

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={enableShadows}
        dpr={dpr}
        camera={{
          position: [0, 3.2, 10.5],
          fov: isMobile ? 48 : 42,
          near: 0.1,
          far: 350,
        }}
        gl={{
          antialias,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: isMobile ? 'default' : 'high-performance',
          precision: isMobile ? 'mediump' : 'highp',
        }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#080d1a');
          scene.fog = new THREE.FogExp2('#080d1a', 0.008);
        }}
      >
        <Suspense fallback={null}>
          <FlightManager
            targetScrollProgress={scrollProgress}
            onTelemetryUpdate={onTelemetryUpdate}
            isTransmissionTyping={isTransmissionTyping}
            selectedOutpost={selectedOutpost}
            onSelectOutpost={onSelectOutpost}
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
            hoveredSkillNodeId={hoveredSkillNodeId}
            onHoverSkillNode={onHoverSkillNode}
            activeClusterId={activeClusterId}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
