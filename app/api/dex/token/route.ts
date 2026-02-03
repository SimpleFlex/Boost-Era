import { NextResponse } from "next/server";

export const runtime = "nodejs";

type DexPair = {
  chainId?: string;
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

function pickBestPairByLiquidity(pairs: DexPair[]) {
  return pairs.slice().sort((a, b) => {
    const la = typeof a.liquidity?.usd === "number" ? a.liquidity.usd : 0;
    const lb = typeof b.liquidity?.usd === "number" ? b.liquidity.usd : 0;
    return lb - la;
  })[0];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const chainId = (searchParams.get("chainId") ?? "").trim();
  const address = (searchParams.get("address") ?? "").trim();

  if (!chainId || !address) {
    return NextResponse.json(
      { ok: false, error: "Missing chainId or address" },
      { status: 400 }
    );
  }

  try {
    // DexScreener tokens endpoint
    const url = `https://api.dexscreener.com/tokens/v1/${encodeURIComponent(
      chainId
    )}/${encodeURIComponent(address)}`;

    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Dex fetch failed" },
        { status: 502 }
      );
    }

    const json: unknown = await res.json();
    if (!Array.isArray(json)) {
      return NextResponse.json(
        { ok: false, error: "Unexpected response" },
        { status: 502 }
      );
    }

    const pairs: DexPair[] = json.filter(isRecord) as DexPair[];
    if (pairs.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No pairs found" },
        { status: 404 }
      );
    }

    const best = pickBestPairByLiquidity(pairs);

    const out = {
      chainId,
      address,
      name: best.baseToken?.name,
      symbol: best.baseToken?.symbol,
      dexUrl: best.url,

      priceUsd: toNumber(best.priceUsd),
      change24hPct:
        typeof best.priceChange?.h24 === "number"
          ? best.priceChange.h24
          : undefined,

      liquidityUsd:
        typeof best.liquidity?.usd === "number"
          ? best.liquidity.usd
          : undefined,
      fdvUsd: typeof best.fdv === "number" ? best.fdv : undefined,
    };

    return NextResponse.json({ ok: true, data: out });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
