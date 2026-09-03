import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { PLANETS, createFlightPath } from '../data/planetsData';

// Higher order quintic smoothstep for silky ease-in-out with zero jerk
function smoothstepQuintic(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Stations definition across scroll progress [0, 1]
const STATIONS = [
  { planetIndex: 0, dwellStart: 0.0, dwellEnd: 0.08 },
  { planetIndex: 1, dwellStart: 0.25, dwellEnd: 0.33 },
  { planetIndex: 2, dwellStart: 0.50, dwellEnd: 0.58 },
  { planetIndex: 3, dwellStart: 0.75, dwellEnd: 0.83 },
  { planetIndex: 4, dwellStart: 0.96, dwellEnd: 1.00 },
];

export function useFlightController(scrollProgress) {
  const flightSpline = useMemo(() => createFlightPath(), []);

  // Persistent vectors to avoid garbage collection stutter
  const stateRef = useRef({
    rocketPos: new THREE.Vector3(0, 0, 0),
    rocketQuat: new THREE.Quaternion(),
    cameraPos: new THREE.Vector3(0, 3.2, 10.5),
    cameraLookAt: new THREE.Vector3(0, 2.0, 0),
    flightState: 'IDLE',
    currentPlanetIndex: 0,
    touchdownTrigger: 0,
    shakeIntensity: 0,
    lastStationIndex: 0,
  });

  // Calculate flight kinematics for current scroll progress
  const evaluateFlight = (progress, delta, time) => {
    const s = Math.max(0, Math.min(1, progress));
    const state = stateRef.current;

    let activeState = 'IDLE';
    let currentPlanetIdx = 0;
    let targetRocketPos = new THREE.Vector3();
    let targetRocketQuat = new THREE.Quaternion();
    let targetCamPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();

    // Check if within any planetary dwell zone
    let landedStation = null;
    for (let i = 0; i < STATIONS.length; i++) {
      if (s >= STATIONS[i].dwellStart && s <= STATIONS[i].dwellEnd) {
        landedStation = STATIONS[i];
        break;
      }
    }

    if (landedStation) {
      // --- LANDED / DWELL STATE ---
      currentPlanetIdx = landedStation.planetIndex;
      const planet = PLANETS[currentPlanetIdx];
      targetRocketPos.set(...planet.landingPad);

      // Rocket stands upright on landing pad
      targetRocketQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);

      // Trigger touchdown event when newly entering landed station
      if (state.lastStationIndex !== currentPlanetIdx) {
        state.lastStationIndex = currentPlanetIdx;
        state.touchdownTrigger += 1;
        state.shakeIntensity = 1.0;
        activeState = 'TOUCHDOWN';
      } else {
        activeState = 'IDLE';
      }

      // Camera sits at a cinematic front-facing vantage point
      targetCamPos.set(
        planet.landingPad[0],
        planet.landingPad[1] + 3.2,
        planet.landingPad[2] + 10.5
      );
      targetLookAt.set(
        planet.landingPad[0],
        planet.landingPad[1] + 2.0,
        planet.landingPad[2]
      );
    } else {
      // --- FLIGHT BETWEEN PLANETS ---
      // Determine which journey segment we are in
      let journeyIdx = 0;
      for (let i = 0; i < STATIONS.length - 1; i++) {
        if (s > STATIONS[i].dwellEnd && s < STATIONS[i + 1].dwellStart) {
          journeyIdx = i;
          break;
        }
      }

      currentPlanetIdx = journeyIdx;
      state.lastStationIndex = -1; // In flight, ready for next touchdown trigger

      const segStart = STATIONS[journeyIdx].dwellEnd;
      const segEnd = STATIONS[journeyIdx + 1].dwellStart;
      const rawT = (s - segStart) / (segEnd - segStart);
      const easedT = smoothstepQuintic(rawT);

      // Map easedT across spline segment
      const splineT = (journeyIdx + easedT) / 4.0;
      targetRocketPos = flightSpline.getPoint(Math.max(0, Math.min(1, splineT)));

      // Compute trajectory tangent for forward heading
      const tangentEpsilon = 0.005;
      const tA = Math.max(0, splineT - tangentEpsilon);
      const tB = Math.min(1, splineT + tangentEpsilon);
      const pA = flightSpline.getPoint(tA);
      const pB = flightSpline.getPoint(tB);
      const tangent = new THREE.Vector3().subVectors(pB, pA).normalize();

      // Compute curvature for banking (roll)
      const tangentNext = flightSpline.getTangent(Math.min(1, splineT + 0.02));
      const curvatureX = (tangentNext.x - tangent.x) * 12.0;
      const bankAngle = THREE.MathUtils.clamp(-curvatureX * 0.6, -0.45, 0.45);

      // Determine sub-flight state (Liftoff, Cruise, Descent)
      if (rawT < 0.22) {
        activeState = 'LIFTOFF';
        const liftoffBlend = rawT / 0.22;
        // Blend from upright orientation into forward trajectory
        const uprightQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
        
        // Orientation aligned with tangent
        const flightQuat = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(new THREE.Vector3(), tangent, new THREE.Vector3(0, 1, 0));
        flightQuat.setFromRotationMatrix(m);

        targetRocketQuat.slerpQuaternions(uprightQuat, flightQuat, liftoffBlend);
      } else if (rawT > 0.78) {
        activeState = 'DESCENT';
        const descentBlend = (rawT - 0.78) / 0.22;
        // Blend from flight trajectory back to upright landing orientation
        const flightQuat = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(new THREE.Vector3(), tangent, new THREE.Vector3(0, 1, 0));
        flightQuat.setFromRotationMatrix(m);

        const uprightQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
        targetRocketQuat.slerpQuaternions(flightQuat, uprightQuat, descentBlend);
      } else {
        activeState = 'CRUISE';
        // Flight rotation matrix with banking roll
        const m = new THREE.Matrix4();
        const upVec = new THREE.Vector3(Math.sin(bankAngle), Math.cos(bankAngle), 0).normalize();
        m.lookAt(new THREE.Vector3(), tangent, upVec);
        targetRocketQuat.setFromRotationMatrix(m);
      }

      // Camera trailing behind rocket along the curve
      const camTrailingDist = 11.5;
      const camElevation = 4.2;
      const camSideOffset = -tangent.x * 2.5;

      targetCamPos.set(
        targetRocketPos.x - tangent.x * camTrailingDist + camSideOffset,
        targetRocketPos.y + camElevation,
        targetRocketPos.z - tangent.z * camTrailingDist
      );

      targetLookAt.set(
        targetRocketPos.x + tangent.x * 3.5,
        targetRocketPos.y + 1.2,
        targetRocketPos.z + tangent.z * 3.5
      );
    }

    // --- Touchdown Camera Shake Decay ---
    if (state.shakeIntensity > 0) {
      state.shakeIntensity = Math.max(0, state.shakeIntensity - delta * 2.4);
      const shakeAmp = state.shakeIntensity * 0.22;
      targetCamPos.x += Math.sin(time * 42) * shakeAmp;
      targetCamPos.y += Math.cos(time * 48) * shakeAmp;
      targetCamPos.z += Math.sin(time * 36) * shakeAmp * 0.7;
    }

    // Smooth dampening for position and quaternion to avoid any jerky transitions
    state.rocketPos.lerp(targetRocketPos, 0.18);
    state.rocketQuat.slerp(targetRocketQuat, 0.15);
    state.cameraPos.lerp(targetCamPos, 0.12);
    state.cameraLookAt.lerp(targetLookAt, 0.14);

    state.flightState = activeState;
    state.currentPlanetIndex = currentPlanetIdx;

    return {
      rocketPos: state.rocketPos,
      rocketQuat: state.rocketQuat,
      cameraPos: state.cameraPos,
      cameraLookAt: state.cameraLookAt,
      flightState: state.flightState,
      currentPlanetIndex: state.currentPlanetIndex,
      touchdownTrigger: state.touchdownTrigger,
      shakeIntensity: state.shakeIntensity,
    };
  };

  return {
    flightSpline,
    evaluateFlight,
  };
}
