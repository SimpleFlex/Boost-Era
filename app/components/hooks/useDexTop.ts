"use client";

import { useEffect, useState } from "react";

export type DexTopRow = {
  id: string;
  chainId: string;
  tokenAddress: string;
  name?: string;
  symbol?: string;
  icon?: string;

  priceUsd?: number;
  change24hPct?: number;
  liquidityUsd?: number;
  fdvUsd?: number;

  dexUrl?: string;
};

type ApiOk = { ok: true; data: DexTopRow[] };

function isApiOk(x: unknown): x is ApiOk {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  if (r.ok !== true) return false;
  return Array.isArray(r.data);
}

export function useDexTop(intervalMs = 12000) {
  const [data, setData] = useState<DexTopRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/dex/top");
        const json: unknown = await res.json();

        if (!cancelled) {
          if (isApiOk(json)) setData(json.data);
          else setError("Bad response from /api/dex/top");
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Network error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    timer = setInterval(run, intervalMs);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [intervalMs]);

  return { data, loading, error };
}
