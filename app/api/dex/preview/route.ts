import { NextResponse } from "next/server";
import { LEADERBOARD_SEEDS } from "@/app/memedrop/data/leaderboard";

type DexPair = {
  baseToken?: { address?: string; symbol?: string; name?: string };
  marketCap?: number | null;
  fdv?: number | null;
  liquidity?: { usd?: number | null };
  priceChange?: { h24?: number | null };
  url?: string;
};

type PreviewRow = {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  marketCapUsd: number | null;
  change24hPct: number | null;
  liquidityUsd: number | null;
  link: string;
};

function pickBestPair(pairs: DexPair[]) {
  return [...pairs].sort(
    (a, b) => (Number(b.liquidity?.usd) || 0) - (Number(a.liquidity?.usd) || 0)
  )[0];
}

function pickMarketCap(p?: DexPair) {
  const mc = typeof p?.marketCap === "number" ? p.marketCap : null;
  const fdv = typeof p?.fdv === "number" ? p.fdv : null;
  return mc ?? fdv;
}

export async function GET() {
  try {
    const addresses = LEADERBOARD_SEEDS.map((t) => t.tokenAddress);
    const url = `https://api.dexscreener.com/tokens/v1/solana/${addresses.join(",")}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `DexScreener failed: ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as DexPair[];

    // Group pools by base token
    const grouped = new Map<string, DexPair[]>();
    for (const p of data) {
      const addr = p.baseToken?.address;
      if (!addr) continue;
      const arr = grouped.get(addr) ?? [];
      arr.push(p);
      grouped.set(addr, arr);
    }

    const rows: PreviewRow[] = LEADERBOARD_SEEDS.map((seed) => {
      const pairs = grouped.get(seed.tokenAddress) ?? [];
      const best = pairs.length ? pickBestPair(pairs) : undefined;

      return {
        id: seed.id,
        name: seed.name,
        symbol: seed.symbol,
        tokenAddress: seed.tokenAddress,
        marketCapUsd: pickMarketCap(best),
        change24hPct:
          typeof best?.priceChange?.h24 === "number"
            ? best.priceChange.h24
            : null,
        liquidityUsd:
          typeof best?.liquidity?.usd === "number" ? best.liquidity.usd : null,
        link:
          best?.url ?? `https://dexscreener.com/solana/${seed.tokenAddress}`,
      };
    });

    return NextResponse.json({ ok: true, data: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
