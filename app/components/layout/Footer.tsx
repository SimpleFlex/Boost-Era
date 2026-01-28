"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    // ✅ remove big gap on top, and add small padding only
    <footer className="mt-6">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        {/* Top glass band */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)]">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Brand / CTA */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Launch-ready promo pages
              </div>

              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white/90 sm:text-3xl">
                <span className="bg-linear-to-r from-yellow-300 via-white to-green-400 bg-clip-text text-transparent">
                  Boost visibility.
                </span>{" "}
                <span className="text-white/90">Ship faster.</span>
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
                Promote your token, generate a clean landing page, and plug into
                the tools your community already uses.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Get Started
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/memedrop"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/10"
                >
                  🎁 MemeDrop
                </Link>
              </div>
            </div>

            {/* Links */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Product
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link className="text-white/80 hover:text-white" href="/">
                    Home
                  </Link>
                  <Link
                    className="text-white/80 hover:text-white"
                    href="/memedrop"
                  >
                    MemeDrop
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Community
                </p>

                <div className="flex flex-col gap-3 text-sm">
                  <a
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white"
                    href="https://x.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter className="h-4 w-4 text-yellow-300" />
                    Twitter / X
                  </a>

                  <a
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white"
                    href="https://t.me/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 text-green-400" />
                    Telegram
                  </a>

                  <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-white/70">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    Wallet-connect only. No email required.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-white/55">
              © {new Date().getFullYear()} Boost Era. All rights reserved.
            </p>

            <div className="flex items-center gap-3 text-xs">
              <Link className="text-white/60 hover:text-white" href="/terms">
                Terms
              </Link>
              <span className="text-white/25">•</span>
              <Link className="text-white/60 hover:text-white" href="/privacy">
                Privacy
              </Link>
              <span className="text-white/25">•</span>
              <Link className="text-white/60 hover:text-white" href="/support">
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ smaller glow, less spacing */}
        <div className="mx-auto mt-4 h-16 max-w-4xl rounded-full bg-linear-to-r from-yellow-300/20 via-purple-500/20 to-green-400/20 blur-3xl" />
      </div>
    </footer>
  );
}
