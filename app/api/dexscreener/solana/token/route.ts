import { NextResponse } from "next/server";

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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const address = url.searchParams.get("address")?.trim();
    if (!address) return new NextResponse("Missing address", { status: 400 });

    const res = await fetch(
      `https://api.dexscreener.com/token-pairs/v1/solana/${encodeURIComponent(address)}`,
      { next: { revalidate: 10 } }
    );

    if (!res.ok)
      return new NextResponse(`DexScreener error: ${res.status}`, {
        status: 502,
      });

    const pairs = (await res.json()) as DexPair[];

    const sorted =
      pairs
        ?.slice()
        .sort((a, b) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0)) ??
      [];

    return NextResponse.json({
      best: sorted[0] ?? null,
      top: sorted.slice(0, 5),
      pairsCount: pairs?.length ?? 0,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected server error";
    return new NextResponse(message, { status: 500 });
  }
}
