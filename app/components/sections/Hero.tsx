"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";

function isSolanaBase58Address(value: string) {
  const v = value.trim();
  if (v.length < 32 || v.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(v);
}

export default function Hero({
  tokenAddress,
  onTokenAddressChange,
  onPreview,
}: {
  tokenAddress: string;
  onTokenAddressChange: (v: string) => void;
  onPreview: () => void;
}) {
  const router = useRouter();
  const { open } = useAppKit();

  // ✅ IMPORTANT: use solana namespace
  const { isConnected } = useAppKitAccount({ namespace: "solana" });

  const trimmed = useMemo(() => tokenAddress.trim(), [tokenAddress]);
  const isValid = useMemo(() => isSolanaBase58Address(trimmed), [trimmed]);

  // ✅ This controls the button state
  const canContinue = isConnected && isValid;

  const [touched, setTouched] = useState(false);

  // ✅ Auto-preview when connected + valid CA
  useEffect(() => {
    if (!canContinue) return;

    const t = setTimeout(() => {
      onPreview();
    }, 350);

    return () => clearTimeout(t);
  }, [canContinue, onPreview]);

  const buttonLabel = !isConnected
    ? "Connect Wallet to Promote"
    : canContinue
      ? "Continue to Promote"
      : "Enter Token Address";

  const onClick = () => {
    if (!isConnected) {
      open({ view: "Connect", namespace: "solana" });
      return;
    }

    setTouched(true);

    if (!isValid) return;

    // Ensure preview is set (for homepage section)
    onPreview();

    // ✅ Go to backend (plan selection)
    router.push(`/promote?ca=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-12">
      <div className="mb-10 text-center">
        <h1 className="text-center text-5xl font-extrabold leading-[1.05] tracking-tight sm:whitespace-nowrap sm:text-7xl md:text-8xl">
          <span className="rainbow-text">Promote Your Meme Coin</span>
        </h1>

        <p className="mt-6 text-5xl font-bold text-white/80">+</p>

        <p className="mx-auto mt-5 max-w-3xl text-xl leading-snug sm:text-2xl">
          <span className="text-white/85">
            Get a full promotion and visibilty
          </span>{" "}
          <span className="text-yellow-300 font-semibold">
            in two simple steps
          </span>
          <span className="text-white/85">.</span>{" "}
          <span className="text-white/85">Pay once and</span>{" "}
          <span className="text-green-400 font-semibold">
            start promoting immediately
          </span>
          <span className="text-white/85">.</span>
        </p>
      </div>

      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-10">
        <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
          <span className="rainbow-text">Promote Your Coin</span>
        </h2>

        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center rounded-full border-2 border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-green-300/90">
            SOLANA
          </span>
        </div>

        <div className="mt-8">
          <label className="block text-base font-semibold text-white/85">
            Token Address
          </label>

          <input
            value={tokenAddress}
            onChange={(e) => onTokenAddressChange(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={!isConnected}
            type="text"
            placeholder={
              isConnected
                ? "Enter your token contract address..."
                : "Connect wallet first..."
            }
            className="mt-4 w-full rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base text-white/90 placeholder:text-white/40 outline-none transition focus:border-white/30 disabled:opacity-50"
          />

          {isConnected && touched && trimmed && !isValid && (
            <p className="mt-3 text-sm text-red-300">
              That doesn’t look like a valid Solana token address.
            </p>
          )}

          <button
            type="button"
            onClick={onClick}
            className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {buttonLabel}
          </button>

          <div className="mt-4 text-center text-sm">
            <span className="text-white/70">Fee:</span>{" "}
            <span className="text-green-400 font-semibold">~0.1 SOL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
