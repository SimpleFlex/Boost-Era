"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Clock, ExternalLink } from "lucide-react";

import dexscreener from "../../public/platforms/dexscreener.png";
import gmgn from "../../public/platforms/gcmn.png";
import birdeye from "../../public/platforms/birdeye.png";
import dextools from "../../public/platforms/dextools.svg";

type TabKey = "dexscreener" | "gmgn" | "birdeye" | "dextools" | "upcoming";

export default function PlatformPreview({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  const tabs = useMemo(
    () => [
      {
        key: "dexscreener" as const,
        name: "DexScreener",
        logo: dexscreener,
        href: `https://dexscreener.com/solana/${tokenAddress}`,
      },
      {
        key: "gmgn" as const,
        name: "GMGN",
        logo: gmgn,
        href: `https://gmgn.ai/sol/token/${tokenAddress}`,
      },
      {
        key: "birdeye" as const,
        name: "Birdeye",
        logo: birdeye,
        href: `https://birdeye.so/solana/token/${tokenAddress}`,
      },
      {
        key: "dextools" as const,
        name: "DexTools",
        logo: dextools,
        href: `https://www.dextools.io/app/solana`,
      },
    ],
    [tokenAddress]
  );

  const [active, setActive] = useState<TabKey>("dexscreener");
  const activeTab = tabs.find((t) => t.key === active);

  return (
    <div className="mt-10">
      {/* Buttons */}
      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
        {tabs.map((t) => {
          const isActive = active === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={[
                // ✅ full width ONLY on mobile grid cells, normal size on desktop
                "w-full inline-flex items-center justify-center gap-3 rounded-2xl border-2 px-5 py-3 text-sm font-semibold backdrop-blur-xl transition sm:w-auto sm:px-7 sm:text-base",
                isActive
                  ? "border-white/30 bg-white/15 text-white shadow-lg"
                  : "border-white/20 bg-white/10 text-white/90 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg",
              ].join(" ")}
            >
              <Image
                src={t.logo}
                alt={`${t.name} logo`}
                width={22}
                height={22}
                className="opacity-90"
              />
              {t.name}
            </button>
          );
        })}

        {/* Upcoming (takes a grid cell on mobile) */}
        <span className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 sm:w-auto sm:px-7 sm:text-base">
          <Clock className="h-5 w-5" />
          Upcoming
        </span>
      </div>

      {/* ✅ BIG Preview / Chart area (FULL WIDTH, TALLER) */}
      <div className="mt-8 w-full rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-white/85">
            Preview:{" "}
            <span className="text-yellow-300 font-extrabold">
              {activeTab?.name ?? "—"}
            </span>
          </div>

          {activeTab?.href && (
            <a
              href={activeTab.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Open on {activeTab.name} <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="mt-4">
          {active === "dexscreener" ? (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <iframe
                title="DexScreener Chart"
                src={`https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=dark`}
                className="w-full h-[560px] sm:h-[620px] lg:h-[720px]"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
              <p className="text-white/80">
                We’re showing the{" "}
                <span className="font-extrabold text-green-300">
                  {activeTab?.name}
                </span>{" "}
                view.
              </p>
              <p className="mt-2 text-sm text-white/60">
                Some platforms block iframe embedding. Use the{" "}
                <span className="text-yellow-300 font-semibold">Open</span>{" "}
                button above to view it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
