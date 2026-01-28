export type LeaderboardProject = {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  marketCapUsd: number;
  change24hPct?: number; // optional
  logo?: string; // optional local path like "/tokens/bonk.png"
  tags?: string[];
};

export const LEADERBOARD_PROJECTS: LeaderboardProject[] = [
  {
    id: "bonk",
    name: "Bonk",
    symbol: "BONK",
    tokenAddress: "So11111111111111111111111111111111111111112",
    marketCapUsd: 1200000000,
    change24hPct: 8.3,
    logo: "/tokens/bonk.png",
    tags: ["Top", "Solana"],
  },
  {
    id: "wif",
    name: "dogwifhat",
    symbol: "WIF",
    tokenAddress: "So11111111111111111111111111111111111111112",
    marketCapUsd: 1800000000,
    change24hPct: -2.1,
    logo: "/tokens/wif.png",
    tags: ["Hot", "Trending"],
  },
  {
    id: "pepe2",
    name: "Pepe 2.0",
    symbol: "PEPE2",
    tokenAddress: "So11111111111111111111111111111111111111112",
    marketCapUsd: 250000000,
    change24hPct: 3.7,
    logo: "/tokens/pepe2.png",
    tags: ["Promoted"],
  },
];
