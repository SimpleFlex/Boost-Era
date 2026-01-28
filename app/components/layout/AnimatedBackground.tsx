"use client";

import { useMemo } from "react";

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
  opacity: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function AnimatedBackground() {
  // Increase count if you want: 80–140 is okay. Don’t go crazy (performance).
  const COUNT = 120;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: COUNT }).map((_, i) => {
      const icon = ICONS[Math.floor(rand(0, ICONS.length))];
      const left = `${rand(0, 100).toFixed(2)}%`;
      const top = `${rand(0, 100).toFixed(2)}%`;
      const size = `${rand(12, 26).toFixed(0)}px`;
      const duration = `${rand(6, 16).toFixed(2)}s`;
      const delay = `${rand(-16, 0).toFixed(2)}s`; // negative = already in motion on load
      const driftX = `${rand(-120, 120).toFixed(0)}px`;
      const driftY = `${rand(-90, 90).toFixed(0)}px`;
      const opacity = `${rand(0.25, 0.9).toFixed(2)}`;

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
        opacity,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {/* keep your moving blobs if you already have them */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="bg-particle"
          style={
            {
              left: p.left,
              top: p.top,
              fontSize: p.size,
              opacity: p.opacity,
              "--dur": p.duration,
              "--delay": p.delay,
              "--dx": p.driftX,
              "--dy": p.driftY,
            } as React.CSSProperties & Record<string, string>
          }
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
}
