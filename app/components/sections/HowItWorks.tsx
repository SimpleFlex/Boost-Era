"use client";

import { Rocket, Palette, TrendingUp } from "lucide-react";
import PlatformPreview from "../platforms/PlatformPreview"; // ✅ use your existing component

export default function HowItWorks() {
  const tokenAddress = "So11111111111111111111111111111111111111112";

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl">
            How It Works
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-base sm:text-lg">
            <span className="text-white/75">Three simple steps to </span>
            promote your coin get a{" "}
            <span className="text-green-400 font-semibold">
              share-ready website
            </span>
            <span className="text-white/75">.</span>
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-300/20 via-white/0 to-green-400/20" />
              <Rocket className="relative h-6 w-6 text-white/85" />
            </div>

            <div className="mt-4 text-lg font-semibold text-white/90">
              <span className="text-yellow-300">Step 1:</span> Promote Your Coin
            </div>

            <p className="mt-2 text-sm leading-relaxed">
              <span className="text-white/65">
                Enter your token address and pay a{" "}
              </span>
              <span className="text-green-400 font-semibold">one-time fee</span>
              <span className="text-white/65">
                {" "}
                to get started. No complex setup required.
              </span>
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 via-white/0 to-yellow-300/20" />
              <Palette className="relative h-6 w-6 text-white/85" />
            </div>

            <div className="mt-4 text-lg font-semibold text-white/90">
              <span className="text-green-400">Step 2:</span> Customize &amp;
              Share
            </div>

            <p className="mt-2 text-sm leading-relaxed">
              <span className="text-white/65">Upload your </span>
              <span className="text-yellow-300 font-semibold">logo</span>
              <span className="text-white/65">, set your </span>
              <span className="text-green-400 font-semibold">token name</span>
              <span className="text-white/65">
                , and instantly get a promotional website with social sharing
                and DEX links.
              </span>
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-300/20 via-white/0 to-green-400/20" />
              <TrendingUp className="relative h-6 w-6 text-white/85" />
            </div>

            <div className="mt-4 text-lg font-semibold text-white/90">
              <span className="text-yellow-300">Instant</span>{" "}
              <span className="text-green-400">Results</span>
            </div>

            <p className="mt-2 text-sm leading-relaxed">
              <span className="text-white/65">
                Your coin will be promoted on{" "}
              </span>
              <span className="text-yellow-300 font-semibold">DexScreener</span>
              <span className="text-white/65">, </span>
              <span className="text-green-400 font-semibold">GMGN</span>
              <span className="text-white/65">, </span>
              <span className="text-yellow-300 font-semibold">Birdeye</span>
              <span className="text-white/65">
                , and more plus a free website generated with the tools you need
                to succeed.
              </span>
            </p>
          </div>
        </div>

        {/* Platforms */}
        <div className="mt-10">
          <div className="text-center text-sm font-semibold text-white/75">
            Supported platforms
          </div>

          {/* ✅ Use existing component */}
          <PlatformPreview tokenAddress={tokenAddress} />
        </div>
      </div>
    </section>
  );
}
