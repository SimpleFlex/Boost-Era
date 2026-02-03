"use client";

import React from "react";
import ContextProvider from "./components/context/index"; // your wagmi/appkit context
import { Providers as SolanaProviders } from "./components/providers"; // your SolanaProvider wrapper

export default function ClientProviders({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  return (
    <ContextProvider cookies={cookies}>
      <SolanaProviders net="mainnet">{children}</SolanaProviders>
    </ContextProvider>
  );
}
