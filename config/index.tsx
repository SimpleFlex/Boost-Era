// config/index.tsx
import { solana } from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

// Get projectId from https://dashboard.reown.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// ✅ VALIDATE projectId exists
if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_PROJECT_ID environment variable is not set. " +
      "Get your Project ID from https://dashboard.reown.com"
  );
}

// Now projectId is guaranteed to be a string (not undefined)
export const validProjectId = projectId;

// Solana network ARRAY - TESTNET
export const networks = [solana] as const;

// Solana Testnet RPC endpoint
export const solanaRpcUrl = "https://api.testnet.solana.com";

// Set up Solana Adapter
export const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// Metadata
export const metadata = {
  name: "BoostEra",
  description: "Promote your Solana meme coins",
  url: "https://boostera.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};
