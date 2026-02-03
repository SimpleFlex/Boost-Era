import Link from "next/link";

type DexPair = {
  baseToken?: { address?: string; symbol?: string; name?: string };
  priceUsd?: string;
  marketCap?: number | null;
  fdv?: number | null;
  liquidity?: { usd?: number | null };
  volume?: { h24?: number | null };
  priceChange?: { h24?: number | null };
  url?: string;
};

type TokenSeed = {
  address: string;
  label?: string;
};

function fmtUsd(n?: number | null) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function pickBestPair(pairs: DexPair[]) {
  return [...pairs].sort(
    (a, b) => (Number(b.liquidity?.usd) || 0) - (Number(a.liquidity?.usd) || 0)
  )[0];
}

function pickMarketCap(p?: DexPair) {
  const mc = typeof p?.marketCap === "number" ? p.marketCap : null;
  const fdv = typeof p?.fdv === "number" ? p.fdv : null;
  return {
    value: mc ?? fdv,
    tag: mc != null ? "MCap" : fdv != null ? "FDV" : null,
  };
}

async function fetchDexScreenerForTokens(addresses: string[]) {
  const url = `https://api.dexscreener.com/tokens/v1/solana/${addresses.join(
    ","
  )}`;

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`DexScreener fetch failed: ${res.status}`);

  const data = (await res.json()) as DexPair[];

  const map = new Map<string, DexPair[]>();
  for (const p of data) {
    const addr = p.baseToken?.address;
    if (!addr) continue;
    const arr = map.get(addr) ?? [];
    arr.push(p);
    map.set(addr, arr);
  }
  return map;
}

const TOP10_TOKENS: TokenSeed[] = [
  {
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    label: "Bonk (BONK)",
  },
  {
    address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    label: "dogwifhat (WIF)",
  },
  {
    address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    label: "Popcat (POPCAT)",
  },
  {
    address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    label: "cat in a dogs world (MEW)",
  },
  {
    address: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82",
    label: "BOOK OF MEME (BOME)",
  },
  {
    address: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4",
    label: "Myro (MYRO)",
  },
  {
    address: "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
    label: "PONKE (PONKE)",
  },
  {
    address: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk",
    label: "Wen (WEN)",
  },
  {
    address: "5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp",
    label: "michi (MICHI)",
  },
  {
    address: "9999FVbjHioTcoJpoBiSjpxHW6xEn3witVuXKqBh2RFQ",
    label: "SLERF (SLERF)",
  },
];

export default async function LeaderboardPage() {
  const addresses = TOP10_TOKENS.map((t) => t.address);

  let grouped: Map<string, DexPair[]> = new Map();
  let error: string | null = null;

  try {
    grouped = await fetchDexScreenerForTokens(addresses);
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e);
  }

  const rows = TOP10_TOKENS.map((seed) => {
    const pairs = grouped.get(seed.address) ?? [];
    const best = pairs.length ? pickBestPair(pairs) : undefined;

    const symbol = best?.baseToken?.symbol ?? "—";
    const name = seed.label ?? best?.baseToken?.name ?? "Unknown";

    const cap = pickMarketCap(best);
    const change24h = best?.priceChange?.h24 ?? null;
    const liqUsd = best?.liquidity?.usd ?? null;

    const link = best?.url ?? `https://dexscreener.com/solana/${seed.address}`;

    return {
      address: seed.address,
      name,
      symbol,
      marketCap: cap.value,
      capTag: cap.tag,
      change24h,
      liqUsd,
      link,
    };
  })
    .sort((a, b) => (Number(b.marketCap) || 0) - (Number(a.marketCap) || 0))
    .slice(0, 10);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10 text-white">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white/90">
            🏆 Leaderboard (Live)
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Top 10 tokens tracked in real-time (DexScreener).
          </p>
        </div>

        <Link
          href="/"
          className="w-fit inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/10"
        >
          <span aria-hidden>←</span> Back to Home
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)]">
        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* ✅ MOBILE VIEW (cards) */}
        <div className="sm:hidden mt-2 space-y-3">
          {rows.map((r, idx) => {
            const positive = (Number(r.change24h) || 0) >= 0;

            return (
              <div
                key={r.address}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white/60">
                        #{idx + 1}
                      </span>
                      <p className="truncate text-sm font-extrabold text-white/90">
                        {r.name}
                      </p>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                        {r.symbol}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/55">
                      {r.address}
                    </p>
                  </div>

                  {typeof r.change24h === "number" ? (
                    <span
                      className={[
                        "shrink-0 rounded-full px-3 py-1 text-xs font-extrabold",
                        positive
                          ? "bg-green-400/15 text-green-300"
                          : "bg-red-400/15 text-red-300",
                      ].join(" ")}
                    >
                      {positive ? "+" : ""}
                      {r.change24h.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-white/50">—</span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] font-semibold text-white/55">
                      Cap
                    </div>
                    <div className="mt-1 font-extrabold text-white/90">
                      {fmtUsd(r.marketCap)}
                      {r.capTag ? (
                        <span className="ml-2 text-[10px] font-semibold text-white/50">
                          {r.capTag}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] font-semibold text-white/55">
                      Liquidity
                    </div>
                    <div className="mt-1 font-extrabold text-white/90">
                      {fmtUsd(r.liqUsd)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    View chart <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ DESKTOP VIEW (table) */}
        <div className="hidden sm:block mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Token</div>
            <div className="col-span-2 text-right">Cap</div>
            <div className="col-span-2 text-right">24h</div>
            <div className="col-span-2 text-right">Liquidity</div>
          </div>

          <div className="divide-y divide-white/10">
            {rows.map((r, idx) => {
              const positive = (Number(r.change24h) || 0) >= 0;

              return (
                <div
                  key={r.address}
                  className="grid grid-cols-12 items-center gap-3 px-4 py-4"
                >
                  <div className="col-span-1 text-sm font-extrabold text-white/80">
                    {idx + 1}
                  </div>

                  <div className="col-span-5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-extrabold text-white/90">
                        {r.name}
                      </p>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                        {r.symbol}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/55">
                      {r.address}
                    </p>
                  </div>

                  <div className="col-span-2 text-right text-sm font-extrabold text-white/85">
                    {fmtUsd(r.marketCap)}
                    {r.capTag ? (
                      <span className="ml-2 text-[10px] font-semibold text-white/50">
                        {r.capTag}
                      </span>
                    ) : null}
                  </div>

                  <div className="col-span-2 text-right">
                    {typeof r.change24h === "number" ? (
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-extrabold",
                          positive
                            ? "bg-green-400/15 text-green-300"
                            : "bg-red-400/15 text-red-300",
                        ].join(" ")}
                      >
                        {positive ? "+" : ""}
                        {r.change24h.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-xs text-white/50">—</span>
                    )}
                  </div>

                  <div className="col-span-2 text-right text-sm font-extrabold text-white/85">
                    {fmtUsd(r.liqUsd)}
                  </div>

                  <div className="col-span-12 mt-3 flex justify-end">
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                    >
                      View chart <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-xs text-white/50">
          If a token shows “—”, DexScreener might not be returning marketCap for
          that pool; we fall back to FDV and label it.
        </p>
      </div>
    </main>
  );
}
