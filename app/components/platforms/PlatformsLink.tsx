"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import dexscrenner from "../../public/platforms/dexscreener.png";
import GMGN from "../../public/platforms/gcmn.png";
import Birdeye from "../../public/platforms/birdeye.png";
import Dextools from "../../public/platforms/dextools.svg";

export default function PlatformLink({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  const items = [
    {
      name: "DexScreener",
      logo: dexscrenner,
      href: `https://dexscreener.com/solana/${tokenAddress}`,
    },
    {
      name: "GMGN",
      logo: GMGN,
      href: `https://gmgn.ai/sol/token/${tokenAddress}`,
    },
    {
      name: "Birdeye",
      logo: Birdeye,
      href: `https://birdeye.so/solana/token/${tokenAddress}`,
    },
    {
      name: "DexTools",
      logo: Dextools,
      href: `https://www.dextools.io/app/solana`,
    },
  ];

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {items.map((item) => {
        const isDexScreener = item.name === "DexScreener";

        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={[
              "inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-white/10",
              "px-5 py-3 text-base font-semibold text-white/90 backdrop-blur-xl",
              "transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg",
              "w-[calc(50%-0.5rem)] sm:w-auto sm:px-7",
              isDexScreener ? "min-w-0" : "",
            ].join(" ")}
          >
            <Image
              src={item.logo}
              alt={`${item.name} logo`}
              width={22}
              height={22}
              className="opacity-90 shrink-0"
            />

            {isDexScreener ? (
              <span className="min-w-0 flex-1 truncate whitespace-nowrap">
                {item.name}
              </span>
            ) : (
              <span>{item.name}</span>
            )}
          </a>
        );
      })}

      <span className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/15 bg-white/5 px-5 py-3 text-base font-semibold text-white/80 w-[calc(50%-0.5rem)] sm:w-auto sm:px-7">
        <Clock className="h-5 w-5 shrink-0" />
        Upcoming
      </span>
    </div>
  );
}
