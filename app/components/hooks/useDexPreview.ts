"use client";

import { useEffect, useState } from "react";

export type PreviewRow = {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  marketCapUsd: number | null;
  change24hPct: number | null;
  liquidityUsd: number | null;
  link: string;
};

type ApiResponse =
  | { ok: true; data: PreviewRow[] }
  | { ok: false; error: string };

export function useDexPreview(intervalMs = 30_000) {
  const [data, setData] = useState<PreviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      try {
        setError(null);
        const res = await fetch("/api/dex/preview", { cache: "no-store" });
        const json: unknown = await res.json();

        const parsed = json as ApiResponse;

        if (!cancelled) {
          if (parsed.ok) setData(parsed.data);
          else setError(parsed.error);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
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
