"use client";

import { useMemo, useEffect, useState } from "react";

const ICONS = ["⭐", "✨", "🌟", "💫", "⚡", "💎", "🚀", "🔥", "🪙", "🎯"];

type Particle = {
  id: number;
  icon: string;
  left: string;
  top: string;
  size: string;
  duration: string;
  delay: string;
  driftX: string;
  driftY: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function AnimatedBackground() {
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  const [isReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // ✅ Drastically reduce particle count on mobile
  // Desktop: 50, Tablet: 30, Mobile: 15
  const COUNT = isReduced ? 0 : isMobile ? 15 : 50;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: COUNT }).map((_, i) => {
      const icon = ICONS[Math.floor(rand(0, ICONS.length))];
      const left = `${rand(0, 100).toFixed(2)}%`;
      const top = `${rand(0, 100).toFixed(2)}%`;
      const size = isMobile
        ? `${rand(10, 18).toFixed(0)}px`
        : `${rand(12, 26).toFixed(0)}px`;
      const duration = `${rand(10, 20).toFixed(2)}s`; // Slower for smoothness
      const delay = `${rand(-20, 0).toFixed(2)}s`;
      const driftX = isMobile
        ? `${rand(-60, 60).toFixed(0)}px`
        : `${rand(-120, 120).toFixed(0)}px`;
      const driftY = isMobile
        ? `${rand(-50, 50).toFixed(0)}px`
        : `${rand(-90, 90).toFixed(0)}px`;

      return {
        id: i,
        icon,
        left,
        top,
        size,
        duration,
        delay,
        driftX,
        driftY,
      };
    });
  }, [COUNT, isMobile]);

  if (isReduced) {
    return null; // Respect reduced motion preference
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {/* Blobs - only render on desktop */}
      {!isMobile && (
        <>
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </>
      )}

      {/* Particles with optimized rendering */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="bg-particle"
          style={
            {
              left: p.left,
              top: p.top,
              fontSize: p.size,
              "--dur": p.duration,
              "--delay": p.delay,
              "--dx": p.driftX,
              "--dy": p.driftY,
              // ✅ Set initial opacity in style to avoid animation repaints
              opacity: "0.6",
            } as React.CSSProperties & Record<string, string>
          }
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
}
