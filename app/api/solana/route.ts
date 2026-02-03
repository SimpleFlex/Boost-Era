import { NextResponse } from "next/server";

type DexPair = {
  pairAddress?: string;
  baseToken?: { address?: string; symbol?: string; name?: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
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

    if (!res.ok) {
      return new NextResponse(`DexScreener error: ${res.status}`, {
        status: 502,
      });
    }

    const pairs = (await res.json()) as DexPair[];

    const best =
      pairs
        ?.slice()
        .sort(
          (a, b) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0)
        )[0] ?? null;

    return NextResponse.json({ best, pairsCount: pairs?.length ?? 0 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected server error";
    return new NextResponse(message, { status: 500 });
  }
}
