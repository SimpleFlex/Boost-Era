"use client";

import { useEffect, useMemo, useState } from "react";

type DexPair = {
  pairAddress?: string;
  dexId?: string;
  baseToken?: { address?: string; symbol?: string; name?: string };
  quoteToken?: { symbol?: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
  fdv?: number;
  volume?: { h24?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
};

type DexApiResponse = {
  best: DexPair | null;
  top: DexPair[];
  pairsCount: number;
};

type BirdeyeOverview = {
  data?: {
    name?: string;
    symbol?: string;
    price?: number;
    mc?: number;
    liquidity?: number;
    v24hUSD?: number;
    holders?: number;
  };
};

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Something went wrong";
}

function formatUsd(n?: number) {
  if (n == null) return "—";
  return `$${Math.round(n).toLocaleString()}`;
}

export default function PlatformPreview({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  const ca = tokenAddress.trim();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [dex, setDex] = useState<DexApiResponse | null>(null);
  const [birdeye, setBirdeye] = useState<BirdeyeOverview | null>(null);
  const [birdeyeNote, setBirdeyeNote] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        setDex(null);
        setBirdeye(null);
        setBirdeyeNote("");

        if (!ca) return;

        // 1) DexScreener (always)
        const dsRes = await fetch(
          `/api/dexscreener/solana/token?address=${encodeURIComponent(ca)}`
        );
        if (!dsRes.ok) throw new Error(await dsRes.text());
        const dsJson = (await dsRes.json()) as DexApiResponse;

        // 2) Birdeye (optional, depends on key)
        let beJson: BirdeyeOverview | null = null;
        try {
          const beRes = await fetch(
            `/api/birdeye/token-overview?address=${encodeURIComponent(ca)}`
          );
          if (beRes.ok) {
            beJson = (await beRes.json()) as BirdeyeOverview;
          } else {
            const msg = await beRes.text();
            setBirdeyeNote(
              msg.includes("BIRDEYE_API_KEY")
                ? "Add Birdeye API key to enable."
                : "Birdeye unavailable."
            );
          }
        } catch {
          setBirdeyeNote("Birdeye unavailable.");
        }

        if (!cancelled) {
          setDex(dsJson);
          setBirdeye(beJson);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ca]);

  const best = dex?.best ?? null;

  const links = useMemo(() => {
    const pair = best?.pairAddress ?? null;
    return {
      dexScreener: pair ? `https://dexscreener.com/solana/${pair}` : null,
      birdeye: ca ? `https://birdeye.so/solana/token/${ca}` : null,
      gmgn: ca ? `https://gmgn.ai/sol/token/${ca}` : null,
      dextools: `https://www.dextools.io/app/solana`,
    };
  }, [ca, best?.pairAddress]);

  const titleName = best?.baseToken?.name ?? birdeye?.data?.name ?? "Token";
  const titleSymbol = best?.baseToken?.symbol ?? birdeye?.data?.symbol ?? "";

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {!ca ? (
          <p className="text-sm text-white/70">
            Enter a token address above, then click{" "}
            <span className="text-white/90">Preview Platforms</span>.
          </p>
        ) : loading ? (
          <p className="text-sm text-white/70">Loading preview…</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-white/90">
                  {titleName}{" "}
                  {titleSymbol ? (
                    <span className="text-white/60">({titleSymbol})</span>
                  ) : null}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Pools found:{" "}
                  <span className="text-white/80">{dex?.pairsCount ?? 0}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {links.dexScreener && (
                  <a
                    href={links.dexScreener}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                  >
                    DexScreener ↗
                  </a>
                )}
                {links.birdeye && (
                  <a
                    href={links.birdeye}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                  >
                    Birdeye ↗
                  </a>
                )}
                {links.gmgn && (
                  <a
                    href={links.gmgn}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                  >
                    GMGN ↗
                  </a>
                )}
                <a
                  href={links.dextools}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                >
                  DEXTools ↗
                </a>
              </div>
            </div>

            {/* Stats grid (DexScreener + Birdeye blended) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Price (USD)"
                value={
                  best?.priceUsd
                    ? `$${best.priceUsd}`
                    : formatUsd(birdeye?.data?.price)
                }
              />
              <Stat
                label="Liquidity"
                value={formatUsd(
                  best?.liquidity?.usd ?? birdeye?.data?.liquidity
                )}
              />
              <Stat
                label="24h Volume"
                value={formatUsd(best?.volume?.h24 ?? birdeye?.data?.v24hUSD)}
              />
              <Stat
                label="24h Buys / Sells"
                value={
                  best?.txns?.h24
                    ? `${best.txns.h24.buys ?? 0} / ${best.txns.h24.sells ?? 0}`
                    : "—"
                }
              />
            </div>

            {/* Birdeye extra */}
            <div className="mt-4 text-sm text-white/70">
              {birdeye?.data?.holders != null ? (
                <>
                  Holders:{" "}
                  <span className="text-white/90">
                    {birdeye.data.holders.toLocaleString()}
                  </span>
                </>
              ) : birdeyeNote ? (
                birdeyeNote
              ) : (
                ""
              )}
            </div>

            {/* Top pools list */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-white/80">
                Top pools (DexScreener)
              </div>
              <div className="mt-3 space-y-2">
                {(dex?.top ?? []).length === 0 ? (
                  <p className="text-sm text-white/70">No pools found yet.</p>
                ) : (
                  dex!.top.map((p, idx) => (
                    <div
                      key={`${p.pairAddress ?? idx}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="text-sm text-white/85">
                        <span className="text-white/60">#{idx + 1}</span>{" "}
                        {p.dexId ? p.dexId.toUpperCase() : "DEX"}
                        {p.quoteToken?.symbol ? (
                          <span className="text-white/60">
                            {" "}
                            / {p.quoteToken.symbol}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm text-white/70">
                        Liquidity:{" "}
                        <span className="text-white/90">
                          {formatUsd(p.liquidity?.usd)}
                        </span>
                      </div>
                      {p.pairAddress && (
                        <a
                          href={`https://dexscreener.com/solana/${p.pairAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-white/80 underline decoration-white/30 hover:decoration-white/70"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}
