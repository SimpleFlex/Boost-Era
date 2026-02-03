import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const address = url.searchParams.get("address")?.trim();
    if (!address) return new NextResponse("Missing address", { status: 400 });

    const key = process.env.BIRDEYE_API_KEY;
    if (!key)
      return new NextResponse("Missing BIRDEYE_API_KEY", { status: 500 });

    const res = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${encodeURIComponent(address)}`,
      {
        headers: {
          accept: "application/json",
          "X-API-KEY": key,
        },
        next: { revalidate: 10 },
      }
    );

    if (!res.ok)
      return new NextResponse(`Birdeye error: ${res.status}`, { status: 502 });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected server error";
    return new NextResponse(message, { status: 500 });
  }
}
