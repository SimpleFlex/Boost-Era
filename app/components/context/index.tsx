"use client";

import React, { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { validProjectId, metadata } from "@/config";

// Create modal once (safe across HMR/StrictMode)
let modal: ReturnType<typeof createAppKit> | null = null;

function initAppKit() {
  if (modal) return modal;

  const solanaAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  });

  // Default network: devnet in development, mainnet in production
  const defaultNetwork =
    process.env.NODE_ENV === "development" ? solanaDevnet : solana;

  modal = createAppKit({
    adapters: [solanaAdapter],
    projectId: validProjectId,
    networks: [solana, solanaTestnet, solanaDevnet],
    defaultNetwork,
    metadata,
    features: {
      analytics: true,
    },
  });

  return modal;
}

// initialize immediately on client
try {
  initAppKit();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error("AppKit initialization error:", message);
}

type ContextProviderProps = {
  children: ReactNode;
  cookies?: string | null; // ✅ accept cookies from layout
};

export default function ContextProvider({ children }: ContextProviderProps) {
  // For Solana adapter, cookies aren’t required like Wagmi SSR hydration,
  // but we accept them so your layout can pass cookies without TS errors. :contentReference[oaicite:2]{index=2}
  return <>{children}</>;
}

export { modal };
