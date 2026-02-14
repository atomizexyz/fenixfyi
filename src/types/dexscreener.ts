export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels?: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns?: {
    h24: { buys: number; sells: number };
  };
  volume?: {
    h24: number;
  };
  priceChange?: {
    h24: number;
  };
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  pairCreatedAt: number;
}

export interface DexScreenerTokenResponse {
  pairs: DexScreenerPair[] | null;
}

export interface ChainPriceData {
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  pairs: DexScreenerPair[];
  bestPair: DexScreenerPair;
}

export type ChainPriceMap = Map<number, ChainPriceData>;
