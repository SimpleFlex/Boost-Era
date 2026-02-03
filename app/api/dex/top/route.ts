import { NextResponse } from "next/server";

export const runtime = "nodejs";

type BoostItem = {
  chainId: string;
  tokenAddress: string;
  icon?: string;
  url?: string;
  amount?: number;
  totalAmount?: number;
};

type DexPair = {
  url?: string;
  priceUsd?: string | number;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  baseToken?: { address?: string; name?: string; symbol?: string };
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function extractArrayFromUnknown(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (isRecord(json)) {
    for (const v of Object.values(json)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function pickBestPairByLiquidity(pairs: DexPair[]) {
  return pairs.slice().sort((a, b) => {
    const la = typeof a.liquidity?.usd === "number" ? a.liquidity.usd : 0;
    const lb = typeof b.liquidity?.usd === "number" ? b.liquidity.usd : 0;
    return lb - la;
  })[0];
}

export async function GET() {
  try {
    // 1) “Doing well” feed
    const boostsRes = await fetch(
      "https://api.dexscreener.com/token-boosts/top/v1",
      {
        next: { revalidate: 15 },
      }
    );

    if (!boostsRes.ok) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch boosts" },
        { status: 502 }
      );
    }

    const boostsJson: unknown = await boostsRes.json();
    const arr = extractArrayFromUnknown(boostsJson);

    const boosted: BoostItem[] = arr
      .filter(isRecord)
      .map((r) => ({
        chainId: typeof r.chainId === "string" ? r.chainId : "",
        tokenAddress: typeof r.tokenAddress === "string" ? r.tokenAddress : "",
        icon: typeof r.icon === "string" ? r.icon : undefined,
        url: typeof r.url === "string" ? r.url : undefined,
        amount: toNumber(r.amount),
        totalAmount: toNumber(r.totalAmount),
      }))
      .filter((t) => t.chainId && t.tokenAddress)
      .slice(0, 50);

    // 2) group by chain to batch fetch pairs
    const byChain = new Map<string, BoostItem[]>();
    for (const t of boosted) {
      const list = byChain.get(t.chainId) ?? [];
      list.push(t);
      byChain.set(t.chainId, list);
    }

    // 3) enrich using /tokens/v1/{chainId}/{tokenAddresses}
    const rows: Array<{
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
    }> = [];

    for (const [chainId, tokens] of byChain.entries()) {
      for (let i = 0; i < tokens.length; i += 30) {
        const chunk = tokens.slice(i, i + 30);
        const addrs = chunk.map((t) => t.tokenAddress).join(",");

        const liveRes = await fetch(
          `https://api.dexscreener.com/tokens/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(
            addrs
          )}`,
          { next: { revalidate: 10 } }
        );

        if (!liveRes.ok) continue;

        const liveJson: unknown = await liveRes.json();
        if (!Array.isArray(liveJson)) continue;

        // Map best pair by baseToken.address
        const bestByToken = new Map<string, DexPair>();

        for (const item of liveJson) {
          if (!isRecord(item)) continue;
          const p = item as DexPair;

          const addr = p.baseToken?.address;
          if (!addr) continue;

          const liq =
            typeof p.liquidity?.usd === "number" ? p.liquidity.usd : 0;
          const existing = bestByToken.get(addr);
          const existingLiq =
            typeof existing?.liquidity?.usd === "number"
              ? existing.liquidity.usd
              : 0;

          if (!existing || liq > existingLiq) bestByToken.set(addr, p);
        }

        for (const t of chunk) {
          const best = bestByToken.get(t.tokenAddress);

          rows.push({
            id: `${chainId}:${t.tokenAddress}`,
            chainId,
            tokenAddress: t.tokenAddress,
            name: best?.baseToken?.name,
            symbol: best?.baseToken?.symbol,
            icon: t.icon,

            priceUsd: toNumber(best?.priceUsd),
            change24hPct:
              typeof best?.priceChange?.h24 === "number"
                ? best.priceChange.h24
                : undefined,
            liquidityUsd:
              typeof best?.liquidity?.usd === "number"
                ? best.liquidity.usd
                : undefined,
            fdvUsd: typeof best?.fdv === "number" ? best.fdv : undefined,

            dexUrl: typeof best?.url === "string" ? best.url : t.url,
          });
        }
      }
    }

    // sort by liquidity (feel free to change to fdvUsd)
    rows.sort((a, b) => (b.liquidityUsd ?? 0) - (a.liquidityUsd ?? 0));

    return NextResponse.json({ ok: true, data: rows });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
