"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PLANS, type PlanId } from "@/app/lib/plans";

function isBase58SolanaAddress(v: string) {
  const s = v.trim();
  if (s.length < 32 || s.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(s);
}

export default function ActivePlanBar() {
  const sp = useSearchParams();

  const ca = (sp.get("ca") ?? "").trim();
  const plan = (sp.get("plan") ?? "").trim() as PlanId;
  const sig = (sp.get("sig") ?? "").trim();

  const planObj = PLANS[plan];
  const show = useMemo(
    () => Boolean(planObj) && isBase58SolanaAddress(ca),
    [planObj, ca]
  );

  if (!show) return null;

  return (
    <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-white/60">Active Plan</div>
          <div className="mt-1 text-base font-extrabold text-white/90">
            {planObj.label}
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-green-300">
          Paid ✅
        </span>
      </div>

      <div className="mt-4 text-xs text-white/60">Token CA</div>
      <div className="mt-1 break-all text-sm font-semibold text-white/85">
        {ca}
      </div>

      {sig ? (
        <>
          <div className="mt-4 text-xs text-white/60">Transaction</div>
          <div className="mt-1 break-all text-sm font-semibold text-white/75">
            {sig}
          </div>
        </>
      ) : null}
    </div>
  );
}
