import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isHttpUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = (searchParams.get("u") ?? "").trim();

  try {
    if (!u || !isHttpUrl(u)) {
      return NextResponse.json(
        { ok: false, error: "Invalid URL" },
        { status: 400 }
      );
    }

    const r = await fetch(u, { cache: "no-store" });
    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: "Image not found" },
        { status: 404 }
      );
    }

    const contentType = r.headers.get("content-type") ?? "image/png";
    const buf = await r.arrayBuffer();

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Proxy failed" },
      { status: 500 }
    );
  }
}
