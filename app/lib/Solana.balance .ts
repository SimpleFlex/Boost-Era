// lib/solana-balance.ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.testnet.solana.com";
const connection = new Connection(SOLANA_RPC_URL);
const MINIMUM_BALANCE = 0.1; // 0.1 SOL

/**
 * Get wallet balance in SOL
 */
export async function getWalletBalance(walletAddress: string): Promise<number> {
  try {
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    const publicKey = new PublicKey(walletAddress);
    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

    return balanceSol;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to fetch wallet balance");
  }
}

/**
 * Check if wallet has minimum balance
 */
export async function hasMinimumBalance(
  walletAddress: string
): Promise<boolean> {
  try {
    const balance = await getWalletBalance(walletAddress);
    return balance >= MINIMUM_BALANCE;
  } catch (error) {
    console.error("Error checking minimum balance:", error);
    return false;
  }
}

/**
 * Format balance for display
 */
export function formatBalance(balanceSol: number): string {
  return balanceSol.toFixed(4);
}

/**
 * Get formatted balance message
 */
export async function getBalanceMessage(walletAddress: string): Promise<{
  balance: number;
  hasMinimum: boolean;
  message: string;
}> {
  try {
    const balance = await getWalletBalance(walletAddress);
    const hasMinimum = balance >= MINIMUM_BALANCE;

    return {
      balance,
      hasMinimum,
      message: hasMinimum
        ? `✓ Balance: ${formatBalance(balance)} SOL`
        : `⚠️ Insufficient balance: ${formatBalance(balance)} SOL (minimum: ${MINIMUM_BALANCE} SOL)`,
    };
  } catch (error) {
    return {
      balance: 0,
      hasMinimum: false,
      message: "Failed to fetch balance",
    };
  }
}
