"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PLANS, type PlanId } from "../../lib/plans";

function formatSol(lamports: number) {
  const sol = lamports / 1_000_000_000;
  return sol.toFixed(4).replace(/\.?0+$/, "");
}

export default function PaymentSuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const ca = (sp.get("ca") ?? "").trim();
  const plan = (sp.get("plan") ?? "discovery") as PlanId;
  const sig = (sp.get("sig") ?? "").trim();

  const current = PLANS[plan];

  const planOrder: PlanId[] = [
    "discovery",
    "starter",
    "growth",
    "authority",
    "authority_plus",
  ];

  const currentIndex = planOrder.indexOf(plan);
  const upgrades = planOrder.slice(currentIndex + 1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-sm text-white/60">Payment Status</div>
        <h1 className="mt-2 text-2xl font-extrabold text-white/90">
          Payment Confirmed ✅
        </h1>

        <div className="mt-6 space-y-3 text-sm text-white/75">
          <div>
            <span className="text-white/60">Token CA:</span>{" "}
            <span className="break-all text-white/90 font-semibold">{ca}</span>
          </div>

          <div>
            <span className="text-white/60">Plan:</span>{" "}
            <span className="text-white/90 font-semibold">{current.label}</span>{" "}
            <span className="text-white/60">
              ({formatSol(current.lamports)} SOL)
            </span>
          </div>

          <div>
            <span className="text-white/60">Transaction:</span>{" "}
            <span className="break-all text-white/90 font-semibold">{sig}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/80">
            What you paid for
          </div>

          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {current.features.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>

          <div className="mt-4 text-sm font-semibold text-white/70">
            {current.purpose}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/promote?ca=${encodeURIComponent(ca)}`}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
          >
            Back to Promote Page
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Upgrade section */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-lg font-bold text-white/90">Upgrade</div>
        <div className="mt-2 text-sm text-white/60">
          Want more coverage? Upgrade to a higher plan.
        </div>

        {upgrades.length === 0 ? (
          <div className="mt-6 text-sm text-white/70">
            You’re already on the highest plan.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {upgrades.map((id) => {
              const p = PLANS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/checkout?ca=${encodeURIComponent(ca)}&plan=${encodeURIComponent(
                        id
                      )}`
                    )
                  }
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:bg-white/10 transition"
                >
                  <div className="text-white/90 font-bold">{p.label}</div>
                  <div className="mt-1 text-sm text-white/60">
                    Pay {formatSol(p.lamports)} SOL
                  </div>
                  <div className="mt-3 text-sm text-white/75 line-clamp-3">
                    {p.features
                      .slice(0, 3)
                      .map((x) => `• ${x}`)
                      .join("  ")}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
