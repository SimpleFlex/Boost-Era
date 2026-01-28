"use client";

import Link from "next/link";
import WalletConnectButton from "../wallet/WalletConnectButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3">
          {/* MOBILE (2 rows) */}
          <div className="sm:hidden">
            {/* Row 1: Logo + Beta */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="bg-linear-to-r from-fuchsia-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    Boost
                  </span>
                  <span className="text-white/90">Era</span>
                </span>
              </Link>

              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/10"
              >
                🏆 Leaderboard
              </Link>
            </div>

            {/* Row 2: MemeDrop + Connect */}
            <div className="mt-3 flex items-center justify-between">
              <Link
                href="/memedrop"
                className="inline-flex items-center gap-2 text-base font-semibold text-amber-300"
              >
                <span aria-hidden>🎁</span> MemeDrop
              </Link>

              <div className="shrink-0">
                <WalletConnectButton />
              </div>
            </div>
          </div>

          {/* DESKTOP (single row) */}
          <div className="hidden h-16 items-center justify-between sm:flex">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="bg-linear-to-r from-fuchsia-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    Boost
                  </span>{" "}
                  <span className="text-white/90">Era</span>
                </span>
              </Link>

              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/10"
              >
                🏆 Leaderboard
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/memedrop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 transition"
              >
                <span aria-hidden>🎁</span> MemeDrop
              </Link>

              <WalletConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
