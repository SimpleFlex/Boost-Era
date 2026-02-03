"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Connection, Transaction } from "@solana/web3.js";
import { useAppKitAccount } from "@reown/appkit/react";
import { PLANS, type PlanId } from "../lib/plans";
import { Buffer } from "buffer";

type CreateTxResponse = {
  transactionBase64: string;
  amountLamports: number;
  merchant: string;
  planLabel: string;
};

function isBase58SolanaAddress(v: string) {
  const s = v.trim();
  if (s.length < 32 || s.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(s);
}

// Minimal provider type (no any)
type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toBase58(): string };
  signAndSendTransaction?: (tx: Transaction) => Promise<{ signature: string }>;
  signTransaction?: (tx: Transaction) => Promise<Transaction>;
};

function getProvider(): SolanaProvider | null {
  const w = window as unknown as { solana?: SolanaProvider };
  return w.solana ?? null;
}

export default function CheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const ca = (sp.get("ca") ?? "").trim();
  const plan = (sp.get("plan") ?? "discovery") as PlanId;

  const { address, isConnected } = useAppKitAccount({ namespace: "solana" });

  const validCA = useMemo(() => isBase58SolanaAddress(ca), [ca]);
  const planOk = useMemo(() => Boolean(PLANS[plan]), [plan]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const rpc =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    "https://api.mainnet-beta.solana.com";

  const pay = async () => {
    try {
      setLoading(true);
      setStatus("");

      if (!isConnected || !address) {
        setStatus("Connect your wallet first.");
        return;
      }
      if (!validCA) {
        setStatus("Invalid token address (CA).");
        return;
      }
      if (!planOk) {
        setStatus("Invalid plan.");
        return;
      }

      // 1) Ask server to build the payment transaction
      setStatus("Preparing payment…");
      const createRes = await fetch("/api/solana/create-payment-tx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payer: address, plan, ca }),
      });

      if (!createRes.ok) throw new Error(await createRes.text());
      const createJson = (await createRes.json()) as CreateTxResponse;

      // 2) Get wallet provider (Phantom/Solflare injection)
      const provider = getProvider();
      if (!provider) {
        setStatus(
          "No Solana wallet provider found in browser (window.solana)."
        );
        return;
      }

      const connection = new Connection(rpc, "confirmed");

      // 3) Deserialize tx from base64
      let tx: Transaction;
      try {
        tx = Transaction.from(
          Buffer.from(createJson.transactionBase64, "base64")
        );
      } catch {
        setStatus("Failed to parse transaction. Server returned invalid tx.");
        return;
      }

      // 4) Sign + send
      setStatus("Please approve the payment in your wallet…");

      let signature: string | null = null;

      if (provider.signAndSendTransaction) {
        const out = await provider.signAndSendTransaction(tx);
        signature = out?.signature ?? null;
      } else if (provider.signTransaction) {
        const signed = await provider.signTransaction(tx);
        signature = await connection.sendRawTransaction(signed.serialize());
      }

      if (!signature) {
        setStatus("Failed to get a transaction signature from wallet.");
        return;
      }

      setStatus("Transaction sent. Confirming…");

      // 5) Confirm on chain
      await connection.confirmTransaction(signature, "confirmed");

      // 6) Verify server-side (critical)
      setStatus("Verifying payment…");

      const verifyRes = await fetch("/api/solana/verify-payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          signature,
          payer: address,
          plan,
          ca,
        }),
      });

      if (!verifyRes.ok) throw new Error(await verifyRes.text());

      setStatus("Payment confirmed ✅ Redirecting…");

      // 7) Redirect to memedrop with active plan info
      router.push(
        `/memedrop?ca=${encodeURIComponent(ca)}&plan=${encodeURIComponent(
          plan
        )}&sig=${encodeURIComponent(signature)}`
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      setStatus(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="text-sm text-white/60">Token Address</div>
        <div className="mt-2 break-all text-white/90 font-semibold">
          {ca || "—"}
        </div>

        <div className="mt-6 text-sm text-white/60">Selected Plan</div>
        <div className="mt-2 text-white/90 font-semibold">
          {PLANS[plan]?.label ?? plan}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={pay}
            disabled={loading || !validCA || !planOk}
            className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Processing…" : "Pay with Wallet"}
          </button>
        </div>

        {status && <p className="mt-4 text-sm text-white/75">{status}</p>}

        <p className="mt-4 text-xs text-white/45">
          RPC: <span className="text-white/60">{rpc}</span>
        </p>
      </div>
    </div>
  );
}
