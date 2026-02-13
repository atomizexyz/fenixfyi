"use client";

import { useReadContracts } from "wagmi";
import { FENIX_ABI } from "@/config/abi";
import { FENIX_CHAINS, type FenixChainConfig } from "@/config/chains";

export interface ChainStats {
  chainConfig: FenixChainConfig;
  totalSupply: bigint | undefined;
  equityPoolSupply: bigint | undefined;
  rewardPoolSupply: bigint | undefined;
  shareRate: bigint | undefined;
  status: "success" | "error" | "loading";
}

const FUNCTIONS = [
  "totalSupply",
  "equityPoolSupply",
  "rewardPoolSupply",
  "shareRate",
] as const;

// Build all contract calls for all chains upfront
const allContracts = FENIX_CHAINS.flatMap((chainConfig) =>
  FUNCTIONS.map((functionName) => ({
    address: chainConfig.fenixContract,
    abi: FENIX_ABI,
    functionName,
    chainId: chainConfig.chain.id,
  }))
);

export function useAllChainsStats() {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: allContracts,
    query: {
      refetchInterval: 30_000,
    },
  });

  const chainsStats: ChainStats[] = FENIX_CHAINS.map((chainConfig, i) => {
    const offset = i * FUNCTIONS.length;

    if (!data) {
      return {
        chainConfig,
        totalSupply: undefined,
        equityPoolSupply: undefined,
        rewardPoolSupply: undefined,
        shareRate: undefined,
        status: "loading" as const,
      };
    }

    const results = FUNCTIONS.map((_, j) => data[offset + j]);
    const hasError = results.some((r) => r?.status === "failure");

    return {
      chainConfig,
      totalSupply: results[0]?.result as bigint | undefined,
      equityPoolSupply: results[1]?.result as bigint | undefined,
      rewardPoolSupply: results[2]?.result as bigint | undefined,
      shareRate: results[3]?.result as bigint | undefined,
      status: hasError ? ("error" as const) : ("success" as const),
    };
  });

  return { chainsStats, isLoading, refetch };
}
