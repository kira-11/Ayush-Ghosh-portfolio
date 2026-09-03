import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile devices and adapt 3D rendering parameters.
 * Clamps DPR, disables heavy shadow passes, and scales particle counts
 * specifically on mobile GPUs to guarantee a stable 60 FPS on mid-range hardware
 * without affecting desktop visual fidelity.
 */
export function useDevicePerformance() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    return (isSmallScreen && hasTouch) || isMobileUA;
  });

  useEffect(() => {
    const handleResize = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      setIsMobile((isSmallScreen && hasTouch) || isMobileUA);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    // On desktop: crisp native DPR up to 2. On mobile: clamp to [1, 1.25] to prevent 3x/4x GPU pixel fill-rate strain
    dpr: isMobile ? [1, 1.25] : [1, 2],
    // On desktop: full real-time shadow map pass. On mobile: disable heavy shadow pass
    enableShadows: !isMobile,
    // On desktop: MSAA antialiasing. On mobile: high PPI screens don't require heavy MSAA passes
    antialias: !isMobile,
    // Particle count multiplier for particle simulations
    particleMultiplier: isMobile ? 0.45 : 1.0,
  };
}
