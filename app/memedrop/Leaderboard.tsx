"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { LEADERBOARD_PROJECTS } from "./data/leaderboard";

function fmtUsd(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toLocaleString()}`;
}

export default function Leaderboard() {
  const sorted = [...LEADERBOARD_PROJECTS].sort(
    (a, b) => b.marketCapUsd - a.marketCapUsd
  );

  return (
    <section className="mt-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-white/90 sm:text-xl">
            🏆 Leaderboard
          </h2>
          <p className="text-xs font-semibold text-white/60">
            Promoted projects (fast loading)
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Project</div>
            <div className="col-span-3 text-right">Market Cap</div>
            <div className="col-span-2 text-right">24h</div>
          </div>

          <div className="divide-y divide-white/10">
            {sorted.map((p, idx) => {
              const positive = (p.change24hPct ?? 0) >= 0;

              return (
                <div
                  key={p.id}
                  className="grid grid-cols-12 items-center gap-3 px-4 py-4"
                >
                  <div className="col-span-1 text-sm font-extrabold text-white/80">
                    {idx + 1}
                  </div>

                  <div className="col-span-6 flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {p.logo ? (
                        <Image
                          src={p.logo}
                          alt={`${p.name} logo`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-extrabold text-white/90">
                          {p.name}
                        </p>

                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                          {p.symbol}
                        </span>

                        {p.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-yellow-300/90"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="mt-1 truncate text-xs text-white/55">
                        {p.tokenAddress}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 text-right text-sm font-extrabold text-white/85">
                    {fmtUsd(p.marketCapUsd)}
                  </div>

                  <div className="col-span-2 text-right">
                    {typeof p.change24hPct === "number" ? (
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-extrabold",
                          positive
                            ? "bg-green-400/15 text-green-300"
                            : "bg-red-400/15 text-red-300",
                        ].join(" ")}
                      >
                        {positive ? "+" : ""}
                        {p.change24hPct.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-xs text-white/50">—</span>
                    )}
                  </div>

                  <div className="col-span-12 mt-3 flex justify-end">
                    <a
                      href={`https://dexscreener.com/solana/${p.tokenAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                    >
                      View on DexScreener <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ See more button */}
        <div className="mt-5 flex justify-end">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/10"
          >
            See more <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
