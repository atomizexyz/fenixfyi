"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type {
  DexScreenerTokenResponse,
  DexScreenerPair,
  ChainPriceData,
  ChainPriceMap,
} from "@/types/dexscreener";
import {
  DEXSCREENER_API_BASE,
  FENIX_TOKEN_ADDRESSES,
  DEXSCREENER_CHAIN_ID_MAP,
  DEXSCREENER_STALE_TIME,
  DEXSCREENER_REFETCH_INTERVAL,
} from "@/config/dexscreener";

async function fetchAllFenixPairs(): Promise<DexScreenerPair[]> {
  const results = await Promise.allSettled(
    FENIX_TOKEN_ADDRESSES.map(async (address) => {
      const res = await fetch(`${DEXSCREENER_API_BASE}/${address}`);
      if (!res.ok) throw new Error(`DexScreener API error: ${res.status}`);
      const data: DexScreenerTokenResponse = await res.json();
      return data.pairs ?? [];
    })
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

function pairLiquidityUsd(pair: DexScreenerPair): number {
  return pair.liquidity?.usd ?? 0;
}

function pairVolume24h(pair: DexScreenerPair): number {
  return pair.volume?.h24 ?? 0;
}

function pairChange24h(pair: DexScreenerPair): number {
  return pair.priceChange?.h24 ?? 0;
}

function buildChainPriceMap(pairs: DexScreenerPair[]): ChainPriceMap {
  const map: ChainPriceMap = new Map();

  for (const pair of pairs) {
    const chainId = DEXSCREENER_CHAIN_ID_MAP[pair.chainId];
    if (chainId === undefined) continue;

    const existing = map.get(chainId);
    if (existing) {
      existing.pairs.push(pair);
      // Use highest-liquidity pair as price source
      if (pairLiquidityUsd(pair) > pairLiquidityUsd(existing.bestPair)) {
        existing.bestPair = pair;
        existing.priceUsd = parseFloat(pair.priceUsd ?? "0");
        existing.priceChange24h = pairChange24h(pair);
      }
      existing.volume24h += pairVolume24h(pair);
      existing.liquidityUsd += pairLiquidityUsd(pair);
    } else {
      map.set(chainId, {
        priceUsd: parseFloat(pair.priceUsd ?? "0"),
        priceChange24h: pairChange24h(pair),
        volume24h: pairVolume24h(pair),
        liquidityUsd: pairLiquidityUsd(pair),
        pairs: [pair],
        bestPair: pair,
      });
    }
  }

  return map;
}

export function useDexScreenerPrices() {
  const { data: pairs, isLoading } = useQuery({
    queryKey: ["dexscreener", "fenix-pairs"],
    queryFn: fetchAllFenixPairs,
    staleTime: DEXSCREENER_STALE_TIME,
    refetchInterval: DEXSCREENER_REFETCH_INTERVAL,
  });

  const priceMap = useMemo(
    () => (pairs ? buildChainPriceMap(pairs) : new Map<number, ChainPriceData>()),
    [pairs]
  );

  const allPairs = useMemo(
    () =>
      (pairs ?? []).slice().sort((a, b) => pairLiquidityUsd(b) - pairLiquidityUsd(a)),
    [pairs]
  );

  return { priceMap, allPairs, isLoading };
}

export function useChainPrice(chainId: number | undefined) {
  const { priceMap, isLoading } = useDexScreenerPrices();
  const data = chainId ? priceMap.get(chainId) : undefined;
  return { data, isLoading };
}
