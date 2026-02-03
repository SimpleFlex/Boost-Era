"use client";

import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";

export default function Page() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [activeToken, setActiveToken] = useState<string>("");

  const onPreview = () => {
    const ca = tokenAddress.trim();
    if (!ca) return;
    setActiveToken(ca);
  };

  // ✅ Always render HowItWorks.
  // It will show placeholder until activeToken is set.
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Hero
          tokenAddress={tokenAddress}
          onTokenAddressChange={setTokenAddress}
          onPreview={onPreview}
        />

        <HowItWorks tokenAddress={activeToken} />
      </main>
    </div>
  );
}
