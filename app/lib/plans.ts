export type PlanId =
  | "discovery"
  | "starter"
  | "growth"
  | "authority"
  | "authority_plus";

export const PLANS: Record<
  PlanId,
  {
    label: string;
    usd: number;
    lamports: number;
    features: string[];
    purpose: string;
  }
> = {
  discovery: {
    label: "$15 Discovery Raffle",
    usd: 15,
    lamports: 0.1 * 1_000_000_000,
    features: [
      "Project discovery listing",
      "Search indexing (token name + contract address)",
      "Entry into a raffle to win a DEX banner placement or a discount",
    ],
    purpose: "Purpose: Discovery + early visibility",
  },

  starter: {
    label: "$250 DEX Starter",
    usd: 250,
    lamports: 1 * 1_000_000_000,
    features: [
      "Banner ads on DexScreener",
      "Banner ads on DEXTools",
      "Basic SEO (token name, ticker, contract address)",
      "Community raiding (awareness push)",
      "Light organic activity support",
    ],
    purpose: "Purpose: Visibility + early chart momentum",
  },

  growth: {
    label: "$400 DEX Growth",
    usd: 400,
    lamports: 1.6 * 1_000_000_000,
    features: [
      "Banner ads on DexScreener",
      "Banner ads on DEXTools",
      "Banner ads on Birdeye",
      "Featured search placement",
      "Advanced SEO",
      "Community raiding + structured promotion",
      "Sustained authentic activity support",
    ],
    purpose: "Purpose: Consistent volume + stronger market trust",
  },

  authority: {
    label: "$600 DEX Authority (KOL Access)",
    usd: 600,
    lamports: 2.4 * 1_000_000_000,
    features: [
      "Premium banners on DexScreener",
      "Premium banners on DEXTools",
      "Premium banners on Birdeye",
      "Top search ranking",
      "High-quality activity strategy",
      "Access to larger accounts + verified promoters",
      "KOL / influencer exposure",
      "Private alpha community visibility",
    ],
    purpose: "Purpose: Strong positioning + credibility",
  },

  authority_plus: {
    label: "$1000 DEX Authority (Premium)",
    usd: 1000,
    lamports: 4 * 1_000_000_000, // ✅ set your real SOL price here
    features: [
      "Premium banners on DexScreener",
      "Premium banners on DEXTools",
      "Premium banners on Birdeye",
      "Top search ranking",
      "High-quality activity strategy",
      "Access to larger accounts + verified promoters",
      "KOL / influencer exposure",
      "Private alpha community visibility",
    ],
    purpose: "Purpose: Maximum visibility + premium credibility",
  },
} as const;
