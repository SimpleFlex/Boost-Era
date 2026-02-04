"use client";

import React, { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { validProjectId, metadata } from "@/config";

type AppKitModal = ReturnType<typeof createAppKit>;
const g = globalThis as unknown as { __appkitModal?: AppKitModal };

function initAppKit() {
  if (g.__appkitModal) return g.__appkitModal;

  if (!validProjectId) {
    throw new Error(
      "Missing Reown projectId (validProjectId). Check your config/env."
    );
  }

  const solanaAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  });

  const defaultNetwork =
    process.env.NODE_ENV === "development" ? solanaDevnet : solana;

  g.__appkitModal = createAppKit({
    adapters: [solanaAdapter],
    projectId: validProjectId,
    networks: [solana, solanaTestnet, solanaDevnet],
    defaultNetwork,
    metadata,
    features: { analytics: true },
  });

  return g.__appkitModal;
}

type ContextProviderProps = {
  children: ReactNode;
  cookies?: string | null;
};

export default function ContextProvider({ children }: ContextProviderProps) {
  // ✅ IMPORTANT: create AppKit BEFORE children render (so hooks work immediately)
  try {
    initAppKit();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AppKit initialization error:", msg);
  }

  return <>{children}</>;
}

export const modal = g.__appkitModal;
