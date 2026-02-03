export type LeaderboardSeed = {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string; // Solana mint
};

export const LEADERBOARD_SEEDS: LeaderboardSeed[] = [
  {
    id: "bonk",
    name: "Bonk",
    symbol: "BONK",
    tokenAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  },
  {
    id: "wif",
    name: "dogwifhat",
    symbol: "WIF",
    tokenAddress: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  },
  {
    id: "popcat",
    name: "Popcat",
    symbol: "POPCAT",
    tokenAddress: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
  },
];
