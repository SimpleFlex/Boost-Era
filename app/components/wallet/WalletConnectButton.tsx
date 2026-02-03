"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect } from "react";
import { getWalletBalance, formatBalance } from "../../lib/Solana.balance ";

const MINIMUM_BALANCE = 0.1;

interface WalletConnectButtonProps {
  onPromoteClick?: () => void;
}

export default function WalletConnectButton({
  onPromoteClick,
}: WalletConnectButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [balance, setBalance] = useState<number | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);

  // Check balance when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkBalance();
    }
  }, [isConnected, address]);

  const checkBalance = async () => {
    setIsCheckingBalance(true);
    try {
      const walletBalance = await getWalletBalance(address!);
      setBalance(walletBalance);
    } catch (err) {
      console.error("Balance check failed:", err);
      setBalance(null);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm font-semibold text-white backdrop-blur-xl transition"
      >
        <span>🔗</span> Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Balance Display */}
      <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-mono text-white/80 backdrop-blur-xl">
        {isCheckingBalance ? (
          <>
            <span className="inline-block h-2 w-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Checking...
          </>
        ) : balance !== null ? (
          <>
            <span
              className={
                balance >= MINIMUM_BALANCE ? "text-green-400" : "text-red-400"
              }
            >
              ◎
            </span>
            {formatBalance(balance)} SOL
          </>
        ) : (
          <>⚠️ Balance error</>
        )}
      </div>

      {/* Promote Button */}
      <button
        onClick={onPromoteClick}
        disabled={
          isCheckingBalance || balance === null || balance < MINIMUM_BALANCE
        }
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold backdrop-blur-xl transition ${
          balance !== null && balance >= MINIMUM_BALANCE && !isCheckingBalance
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {balance !== null && balance < MINIMUM_BALANCE ? (
          <>⚠️ Insufficient Balance</>
        ) : (
          <>
            <span>🚀</span> Promote Your Coin
          </>
        )}
      </button>

      {/* Refresh Balance */}
      <button
        onClick={checkBalance}
        disabled={isCheckingBalance}
        className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white/70 hover:bg-white/15 transition disabled:opacity-50"
        title="Refresh balance"
      >
        🔄
      </button>
    </div>
  );
}
