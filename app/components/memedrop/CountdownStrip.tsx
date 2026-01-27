"use client";

import { useEffect, useMemo, useState } from "react";

function useCountdown(targetDate: string) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-[88px] rounded-2xl border border-white/10 bg-gradient-to-b from-fuchsia-500/40 to-purple-700/40 px-4 py-3 text-center shadow-[0_20px_70px_-50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="text-2xl font-extrabold text-white/95">{value}</div>
      <div className="text-[11px] font-semibold text-white/80">{label}</div>
    </div>
  );
}

export default function CountdownStrip({ target }: { target: string }) {
  const { days, hours, minutes, seconds } = useCountdown(target);

  return (
    <div className="mt-6 flex flex-nowrap items-center justify-center gap-4">
      <Box value={days} label="Days" />
      <Box value={hours} label="Hours" />
      <Box value={minutes} label="Minutes" />
      <Box value={seconds} label="Seconds" />
    </div>
  );
}
