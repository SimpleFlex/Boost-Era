"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ✅ Correct import for App Router + lib folder
import { PLANS, type PlanId } from "../lib/plans";

function isBase58SolanaAddress(v: string) {
  const s = v.trim();
  if (s.length < 32 || s.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(s);
}

function formatSol(lamports: number) {
  const sol = lamports / 1_000_000_000;
  return sol.toFixed(4).replace(/\.?0+$/, "");
}

export default function PromotePage() {
  const sp = useSearchParams();
  const router = useRouter();

  const ca = (sp.get("ca") ?? "").trim();
  const validCA = useMemo(() => isBase58SolanaAddress(ca), [ca]);

  const [selected, setSelected] = useState<PlanId>("discovery");
  const chosen = PLANS[selected];

  const onContinueToPayment = () => {
    router.push(
      `/checkout?ca=${encodeURIComponent(ca)}&plan=${encodeURIComponent(
        selected
      )}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 flex-1">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
          >
            ← Back to Home
          </Link>

          <div className="text-xs text-white/50">
            Step 2 of 3 • Select a plan
          </div>
        </div>

        {/* CA header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="text-sm font-semibold text-white/70">
            Promote Backend
          </div>

          <div className="mt-4">
            <div className="text-xs text-white/50">Token Contract Address</div>
            <div className="mt-2 break-all text-lg font-semibold text-white/90">
              {ca || "—"}
            </div>

            {!validCA && (
              <p className="mt-3 text-sm text-red-300">
                Invalid CA in URL. Go back and enter a valid Solana token
                address.
              </p>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {(Object.keys(PLANS) as PlanId[]).map((id) => {
            const p = PLANS[id];
            const active = id === selected;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`rounded-3xl border p-6 text-left transition ${
                  active
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-white/90">
                      {p.label}
                    </div>

                    <div className="mt-2 text-sm text-white/60">
                      USD: <span className="text-white/85">${p.usd}</span>
                    </div>

                    <div className="mt-1 text-sm text-white/60">
                      Wallet debit:{" "}
                      <span className="text-white/85">
                        {formatSol(p.lamports)} SOL
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                    {active ? "Selected" : "Select"}
                  </span>
                </div>

                {/* ✅ What they are paying for */}
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {p.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                <div className="mt-4 text-sm font-semibold text-white/70">
                  {p.purpose}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <div className="text-sm text-white/60">Selected plan</div>
            <div className="mt-1 text-lg font-semibold text-white/90">
              {chosen.label}
            </div>
            <div className="mt-1 text-sm text-white/60">
              You will be charged{" "}
              <span className="text-white/85">
                {formatSol(chosen.lamports)} SOL
              </span>{" "}
              from your connected wallet.
            </div>
          </div>

          <button
            type="button"
            disabled={!validCA}
            onClick={onContinueToPayment}
            className="rounded-2xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
