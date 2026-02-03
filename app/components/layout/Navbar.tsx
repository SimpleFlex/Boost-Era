"use client";

import Link from "next/link";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

function shortAddr(addr?: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export default function Navbar() {
  const { open } = useAppKit();

  // ✅ IMPORTANT: bind to solana namespace so state matches the wallets you're connecting
  const { isConnected, address, status } = useAppKitAccount({
    namespace: "solana",
  });

  const { disconnect } = useDisconnect();

  const handleWalletClick = () => {
    if (isConnected) {
      // ✅ When connected, show account
      open({ view: "Account" });
      return;
    }

    // ✅ When disconnected, force Solana connect screen
    open({ view: "Connect", namespace: "solana" });
  };

  const handleDisconnect = async () => {
    // disconnect only solana session (clean logout)
    await disconnect({ namespace: "solana" });
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3">
          {/* MOBILE */}
          <div className="sm:hidden">
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

            <div className="mt-3 flex items-center justify-between gap-2">
              <Link
                href="/memedrop"
                className="inline-flex items-center gap-2 text-base font-semibold text-amber-300"
              >
                <span aria-hidden>🎁</span> MemeDrop
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWalletClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition"
                >
                  {isConnected ? `✓ ${shortAddr(address)}` : " Connect Wallet"}
                </button>

                {isConnected && (
                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>

            {/* Optional tiny status line for debugging */}
            <p className="mt-2 text-xs text-white/50">status: {status}</p>
          </div>

          {/* DESKTOP */}
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

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWalletClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition"
                >
                  {isConnected ? `✓ ${shortAddr(address)}` : " Connect Wallet"}
                </button>

                {isConnected && (
                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
