"use client";

import { Trophy, Users, Sparkles } from "lucide-react";

export default function MemeDropPanels() {
  return (
    <section className="mx-auto mt-10 w-full max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: How MemeDrop Works (spans 2 cols on desktop like screenshot) */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)]">
          <div className="p-7 sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-white/90 sm:text-2xl">
              How MemeDrop Works
            </h2>

            <div className="mt-6 space-y-5">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-extrabold text-white">
                  1
                </div>
                <div>
                  <p className="text-sm font-extrabold text-purple-300">
                    Promote Your Meme Coin
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    Pay{" "}
                    <span className="font-extrabold text-yellow-300">$15</span>{" "}
                    to promote your token and win 1 sol
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-extrabold text-white">
                  2
                </div>
                <div>
                  <p className="text-sm font-extrabold text-pink-300">
                    Automatic Entry
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    You’re automatically entered into the weekly MemeDrop.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-extrabold text-white">
                  3
                </div>
                <div>
                  <p className="text-sm font-extrabold text-green-300">
                    Win <span className="text-yellow-300">1 SOL</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    Winner announced every Sunday at{" "}
                    <span className="font-semibold text-white/85">9PM UTC</span>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* CTA bar */}
            <div className="mt-7">
              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:opacity-95"
              >
                ⚡ 🚀 Promote &amp; Enter
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Updates + Winners */}
        <div className="lg:col-span-1 space-y-6">
          {/* Get Updates */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-8">
            <h3 className="text-base font-extrabold text-white/90 sm:text-lg">
              Get Updates (Optional)
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/70">
                  Twitter Handle
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">
                  Email
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="button"
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-95"
              >
                🟦 Get Winner Notifications
              </button>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-white/60">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                No spam. Opt-out anytime.
              </div>
            </div>
          </div>

          {/* Previous Winners */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-8">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-300" />
              <h3 className="text-base font-extrabold text-white/90 sm:text-lg">
                Previous Winners
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { addr: "9WzDXw...K7pQm", week: "Week 1", sol: "1 SOL" },
                { addr: "7VbGHs...N2xRt", week: "Week 2", sol: "1 SOL" },
                { addr: "4KcMnP...J8wVk", week: "Week 3", sol: "1 SOL" },
              ].map((w) => (
                <div
                  key={w.week}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-extrabold text-yellow-300">
                      {w.addr}
                    </p>
                    <p className="text-xs text-white/55">{w.week}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-green-300">
                      {w.sol}
                    </p>
                    <p className="text-xs text-white/55">Won</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-white/60">
              <Users className="h-4 w-4 text-green-300" />
              Updated weekly
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
