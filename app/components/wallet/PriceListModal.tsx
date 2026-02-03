"use client";

import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { signMessage } from "../../lib/Wallet.utils";

interface PriceOption {
  id: string;
  label: string;
  amount: number;
  type: "sol" | "fiat";
  description: string;
  icon: string;
}

const PRICE_OPTIONS: PriceOption[] = [
  {
    id: "raffle",
    label: "Raffle Entry",
    amount: 15,
    type: "fiat",
    description: "$15 USD",
    icon: "🎰",
  },
  {
    id: "250",
    label: "Promotion",
    amount: 250,
    type: "sol",
    description: "250 SOL",
    icon: "🚀",
  },
  {
    id: "400",
    label: "Promotion",
    amount: 400,
    type: "sol",
    description: "400 SOL",
    icon: "⭐",
  },
  {
    id: "600",
    label: "Promotion",
    amount: 600,
    type: "sol",
    description: "600 SOL",
    icon: "💎",
  },
  {
    id: "1000",
    label: "Promotion",
    amount: 1000,
    type: "sol",
    description: "1000 SOL",
    icon: "👑",
  },
];

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress?: string;
}

export function PriceListModal({
  isOpen,
  onClose,
  tokenAddress,
}: PriceListModalProps) {
  const { address } = useAppKitAccount();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  if (!isOpen) return null;

  const handleSelectPlan = async (option: PriceOption) => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    setSelectedOption(option.id);
    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      // Sign payment authorization
      const paymentMessage = `Authorize payment of ${option.amount} ${option.type.toUpperCase()} for BoostEra promotion on ${new Date().toISOString()}`;

      const signature = await signMessage(address, paymentMessage);

      // Call backend to process payment
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          tokenAddress: tokenAddress || "",
          amount: option.amount,
          paymentType: option.type,
          paymentId: option.id,
          signature: signature,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Payment failed");
        setSelectedOption(null);
        setIsProcessing(false);
        return;
      }

      // Show success
      setSuccess(
        `✓ Payment of ${option.amount} ${option.type.toUpperCase()} authorized!`
      );

      console.log("Payment processed:", data);

      // Close modal after 2 seconds
      setTimeout(() => {
        setSelectedOption(null);
        onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Payment authorization failed";
      setError(errorMsg);
      setSelectedOption(null);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - CENTERED */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Choose Your Promotion Plan
              </h2>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="text-white/60 hover:text-white transition disabled:opacity-50 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-white/70 text-sm">
              Select a plan and sign to authorize payment
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                <p className="text-red-300 text-sm font-semibold">⚠️ {error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
                <p className="text-green-300 text-sm font-semibold">
                  {success}
                </p>
              </div>
            )}

            {/* Price Grid - CENTERED, 2 columns on desktop, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              {PRICE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectPlan(option)}
                  disabled={isProcessing}
                  className={`group rounded-2xl border-2 p-6 transition ${
                    selectedOption === option.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    {isProcessing && selectedOption === option.id ? (
                      <div className="text-3xl">
                        <span className="inline-block h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      </div>
                    ) : (
                      <span className="text-4xl">{option.icon}</span>
                    )}

                    <div>
                      <p className="font-semibold text-white text-sm">
                        {option.label}
                      </p>
                      <p className="text-lg font-bold text-white mt-1">
                        {option.amount}
                      </p>
                      <p className="text-xs text-white/60 uppercase mt-1 font-semibold">
                        {option.type}
                      </p>
                    </div>

                    {isProcessing && selectedOption === option.id && (
                      <p className="text-xs text-blue-300 mt-2">Signing...</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="text-center text-xs text-white/60 mt-6 p-4 rounded-xl bg-white/5">
              <p>
                Each plan includes promotion on DexScreener, GMGN, Birdeye &
                DexTools
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 sm:p-8">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full rounded-xl bg-white/10 hover:bg-white/20 px-6 py-3 font-semibold text-white transition disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
