import * as THREE from 'three';

export const PLANETS = [
  {
    id: 'origin',
    name: 'Origin Outpost',
    section: 'About',
    code: 'ALPHA-01',
    center: [0, -1.0, 0],
    landingPad: [0, 0, 0],
    color: '#c8d2dc',
    accentColor: '#94a3b8',
    rimColor: '#cbd5e1',
    radius: 12,
    craters: [
      { pos: [-4.2, 0, 2.2], radius: 1.5, height: 0.38, segments: 10, rotY: 0.4 },
      { pos: [4.4, -0.05, 1.5], radius: 1.7, height: 0.42, segments: 12, rotY: 0.8 },
      { pos: [-2.6, 0.05, -3.2], radius: 1.1, height: 0.3, segments: 9, rotY: 1.2 },
      { pos: [5.2, -0.2, -2.8], radius: 1.8, height: 0.45, segments: 11, rotY: 2.1 },
      { pos: [-1.6, 0, 1.3], radius: 0.75, height: 0.22, segments: 8, rotY: 0.2 },
    ],
    rocks: [
      { pos: [-1.4, 0.1, 0.9], scale: 0.14 },
      { pos: [1.3, 0.08, 0.8], scale: 0.12 },
      { pos: [-0.9, 0.06, 2.1], scale: 0.18 },
      { pos: [2.5, 0.12, 1.9], scale: 0.22 },
      { pos: [3.8, 0.08, 3.2], scale: 0.26 },
    ],
  },
  {
    id: 'basalt',
    name: 'Basalt Reach',
    section: 'Experience',
    code: 'BETA-02',
    center: [22, 8.0, -38],
    landingPad: [22, 9.0, -38],
    color: '#475569',
    accentColor: '#334155',
    rimColor: '#64748b',
    radius: 13,
    craters: [
      { pos: [20.2, 9.0, -36.2], radius: 1.6, height: 0.4, segments: 10, rotY: 0.6 },
      { pos: [24.8, 8.95, -39.5], radius: 1.4, height: 0.35, segments: 9, rotY: 1.1 },
      { pos: [21.0, 9.05, -41.2], radius: 1.9, height: 0.48, segments: 12, rotY: 2.0 },
    ],
    rocks: [
      { pos: [20.8, 9.1, -37.1], scale: 0.18 },
      { pos: [23.4, 9.08, -36.8], scale: 0.24 },
      { pos: [22.9, 9.06, -39.4], scale: 0.15 },
    ],
  },
  {
    id: 'martian',
    name: 'Rust Dunes',
    section: 'Projects',
    code: 'GAMMA-03',
    center: [-18, 17.0, -78],
    landingPad: [-18, 18.0, -78],
    color: '#9a3412',
    accentColor: '#7c2d12',
    rimColor: '#c2410c',
    radius: 14,
    craters: [
      { pos: [-20.5, 18.0, -76.5], radius: 2.0, height: 0.5, segments: 12, rotY: 0.3 },
      { pos: [-15.8, 17.95, -79.8], radius: 1.7, height: 0.42, segments: 11, rotY: 1.5 },
      { pos: [-17.2, 18.05, -81.2], radius: 1.3, height: 0.32, segments: 9, rotY: 0.9 },
    ],
    rocks: [
      { pos: [-19.2, 18.1, -77.2], scale: 0.22 },
      { pos: [-16.5, 18.08, -76.9], scale: 0.19 },
      { pos: [-17.1, 18.06, -79.5], scale: 0.28 },
    ],
  },
  {
    id: 'cobalt',
    name: 'Cobalt Spires',
    section: 'Skills',
    code: 'DELTA-04',
    center: [16, 26.0, -118],
    landingPad: [16, 27.0, -118],
    color: '#1e3a5f',
    accentColor: '#0f2744',
    rimColor: '#38bdf8',
    radius: 13,
    craters: [
      { pos: [14.0, 27.0, -116.5], radius: 1.5, height: 0.38, segments: 10, rotY: 0.5 },
      { pos: [18.2, 26.95, -119.8], radius: 1.8, height: 0.45, segments: 11, rotY: 1.2 },
      { pos: [15.2, 27.05, -121.0], radius: 1.2, height: 0.3, segments: 8, rotY: 2.2 },
    ],
    rocks: [
      { pos: [14.9, 27.1, -117.1], scale: 0.16 },
      { pos: [17.5, 27.08, -116.8], scale: 0.25 },
      { pos: [16.8, 27.06, -119.2], scale: 0.14 },
    ],
  },
  {
    id: 'amber',
    name: 'Amber Sanctum',
    section: 'Contact',
    code: 'OMEGA-05',
    center: [0, 35.0, -158],
    landingPad: [0, 36.0, -158],
    color: '#362f2d',
    accentColor: '#1c1917',
    rimColor: '#f59e0b',
    radius: 15,
    craters: [
      { pos: [-2.5, 36.0, -156.2], radius: 1.9, height: 0.46, segments: 11, rotY: 0.7 },
      { pos: [2.8, 35.95, -159.5], radius: 1.6, height: 0.4, segments: 10, rotY: 1.8 },
      { pos: [-1.2, 36.05, -161.0], radius: 1.4, height: 0.35, segments: 9, rotY: 0.4 },
    ],
    rocks: [
      { pos: [-1.4, 36.1, -156.9], scale: 0.2 },
      { pos: [1.8, 36.08, -156.5], scale: 0.22 },
      { pos: [0.9, 36.06, -159.2], scale: 0.17 },
    ],
  },
];

// Helper to build a continuous cinematic 3D flight trajectory curve
export function createFlightPath() {
  const points = [];

  for (let i = 0; i < PLANETS.length - 1; i++) {
    const pCurrent = PLANETS[i].landingPad;
    const pNext = PLANETS[i + 1].landingPad;

    // 1. Liftoff waypoint: ascend vertically above current landing pad
    const liftoffWaypoint = [
      pCurrent[0],
      pCurrent[1] + 3.5,
      pCurrent[2] - 1.5,
    ];

    // 2. High cruise arc midpoints: lofted flight between the planets with curve
    const midX = (pCurrent[0] + pNext[0]) / 2 + (i % 2 === 0 ? 5.0 : -5.0);
    const midY = (pCurrent[1] + pNext[1]) / 2 + 5.5; // High loft
    const midZ = (pCurrent[2] + pNext[2]) / 2;
    const cruiseMidpoint = [midX, midY, midZ];

    // 3. Pre-landing descent waypoint: hover vertically above target landing pad
    const descentWaypoint = [
      pNext[0],
      pNext[1] + 3.8,
      pNext[2] + 1.5,
    ];

    if (i === 0) {
      points.push(new THREE.Vector3(...pCurrent));
    }
    points.push(new THREE.Vector3(...liftoffWaypoint));
    points.push(new THREE.Vector3(...cruiseMidpoint));
    points.push(new THREE.Vector3(...descentWaypoint));
    points.push(new THREE.Vector3(...pNext));
  }

  // Centripetal Catmull-Rom spline ensures no overshoot or loops
  return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
}
