import Link from "next/link";

type DexPair = {
  baseToken?: { address?: string; symbol?: string; name?: string };
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  url?: string;
};

type TokenSeed = {
  address: string;
  label?: string; // optional custom name
};

function fmtUsd(n?: number) {
  if (!n || Number.isNaN(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function pickBestPair(pairs: DexPair[]) {
  // pick the most liquid pool so the numbers are stable
  return [...pairs].sort(
    (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
  )[0];
}

async function fetchDexScreenerForTokens(addresses: string[]) {
  // DexScreener supports multiple token addresses (comma-separated)
  const url = `https://api.dexscreener.com/tokens/v1/solana/${addresses.join(",")}`;

  const res = await fetch(url, {
    // refresh often (real-ish tracking)
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error(`DexScreener fetch failed: ${res.status}`);
  const data = (await res.json()) as DexPair[];

  // group by token address
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

// ✅ Put your 10 tokens here (real tokens you want to track)
const TOP10_TOKENS: TokenSeed[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    label: "Wrapped SOL",
  },
  // REPLACE the rest with your promoted tokens:
  { address: "PUT_TOKEN_ADDRESS_2_HERE" },
  { address: "PUT_TOKEN_ADDRESS_3_HERE" },
  { address: "PUT_TOKEN_ADDRESS_4_HERE" },
  { address: "PUT_TOKEN_ADDRESS_5_HERE" },
  { address: "PUT_TOKEN_ADDRESS_6_HERE" },
  { address: "PUT_TOKEN_ADDRESS_7_HERE" },
  { address: "PUT_TOKEN_ADDRESS_8_HERE" },
  { address: "PUT_TOKEN_ADDRESS_9_HERE" },
  { address: "PUT_TOKEN_ADDRESS_10_HERE" },
];

export default async function LeaderboardPage() {
  const addresses = TOP10_TOKENS.map((t) => t.address);

  let grouped: Map<string, DexPair[]> = new Map();
  let error: string | null = null;

  try {
    grouped = await fetchDexScreenerForTokens(addresses);
  } catch (e: unknown) {
    error =
      (e instanceof Error ? e.message : String(e)) ??
      "Failed to load leaderboard data.";
  }

  const rows = TOP10_TOKENS.map((seed) => {
    const pairs = grouped.get(seed.address) ?? [];
    const best = pairs.length ? pickBestPair(pairs) : undefined;

    const symbol = best?.baseToken?.symbol ?? "—";
    const name = seed.label ?? best?.baseToken?.name ?? "Unknown";
    const marketCap = best?.marketCap ?? best?.fdv; // fallback to FDV if needed
    const change24h = best?.priceChange?.h24;
    const liqUsd = best?.liquidity?.usd;
    const vol24h = best?.volume?.h24;
    const link = best?.url ?? `https://dexscreener.com/solana/${seed.address}`;

    return {
      address: seed.address,
      name,
      symbol,
      marketCap,
      change24h,
      liqUsd,
      vol24h,
      link,
    };
  })
    // sort by market cap descending
    .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
    .slice(0, 10);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 text-white">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white/90 sm:text-3xl">
            🏆 Leaderboard (Live)
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Top 10 tokens tracked in real-time (DexScreener).
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/10"
        >
          <span aria-hidden>←</span> Back to Home
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-8">
        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/60">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Token</div>
            <div className="col-span-2 text-right">MCap</div>
            <div className="col-span-2 text-right">24h</div>
            <div className="col-span-2 text-right">Liquidity</div>
          </div>

          <div className="divide-y divide-white/10">
            {rows.map((r, idx) => {
              const positive = (r.change24h ?? 0) >= 0;

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
                      View chart
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-xs text-white/50">
          Tip: replace the 10 token addresses in{" "}
          <span className="text-white/70 font-semibold">TOP10_TOKENS</span>.
          This page auto-refreshes.
        </p>
      </div>
    </main>
  );
}
