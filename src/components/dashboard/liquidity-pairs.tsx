"use client";

import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAccount } from "wagmi";
import { mainnet } from "wagmi/chains";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDexScreenerPrices } from "@/hooks/use-dexscreener-prices";
import { DEXSCREENER_CHAIN_ID_MAP } from "@/config/dexscreener";
import { getChainConfig } from "@/config/chains";
import { formatUsd, formatPercent } from "@/lib/utils";
import type { DexScreenerPair } from "@/types/dexscreener";

function PairRow({ pair }: { pair: DexScreenerPair }) {
  const priceUsd = parseFloat(pair.priceUsd ?? "0");
  const change = pair.priceChange?.h24 ?? 0;
  const isPositive = change >= 0;

  return (
    <tr className="border-b border-ash-100 transition-colors hover:bg-ash-50/50 dark:border-ash-800 dark:hover:bg-ash-800/30">
      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
        <span className="text-sm font-semibold capitalize text-ash-900 dark:text-ash-100">
          {pair.chainId}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
        <span className="text-sm font-medium text-ash-900 dark:text-ash-100">
          {pair.baseToken.symbol}/{pair.quoteToken.symbol}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
        <span className="text-sm capitalize text-ash-600 dark:text-ash-400">
          {pair.dexId}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        <span className="text-ash-900 dark:text-ash-100">
          {formatUsd(priceUsd)}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm sm:px-4">
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {formatPercent(change)}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        <span className="text-ash-900 dark:text-ash-100">
          <NumberFlow
            value={pair.volume?.h24 ?? 0}
            format={{
              style: "currency",
              currency: "USD",
              notation: "compact",
              maximumFractionDigits: 1,
            }}
            transformTiming={{ duration: 600, easing: "ease-out" }}
          />
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        <span className="text-ash-900 dark:text-ash-100">
          <NumberFlow
            value={pair.liquidity?.usd ?? 0}
            format={{
              style: "currency",
              currency: "USD",
              notation: "compact",
              maximumFractionDigits: 1,
            }}
            transformTiming={{ duration: 600, easing: "ease-out" }}
          />
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
        <a
          href={pair.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ash-400 transition-colors hover:text-fenix-500"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </td>
    </tr>
  );
}

function PairCard({ pair }: { pair: DexScreenerPair }) {
  const t = useTranslations("dex");
  const priceUsd = parseFloat(pair.priceUsd ?? "0");
  const change = pair.priceChange?.h24 ?? 0;
  const isPositive = change >= 0;

  return (
    <Card variant="glow" className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-ash-900 dark:text-ash-100">
              {pair.baseToken.symbol}/{pair.quoteToken.symbol}
            </span>
            <span className="ml-2 text-xs capitalize text-ash-500 dark:text-ash-400">
              {pair.chainId} &middot; {pair.dexId}
            </span>
          </div>
          <a
            href={pair.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash-400 transition-colors hover:text-fenix-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("price")}
            </p>
            <p className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              {formatUsd(priceUsd)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("change_24h")}
            </p>
            <p
              className={`inline-flex items-center gap-1 text-sm font-semibold ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {formatPercent(change)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("volume_24h")}
            </p>
            <p className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              {formatUsd(pair.volume?.h24 ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("liquidity")}
            </p>
            <p className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              {formatUsd(pair.liquidity?.usd ?? 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PairSkeletonRow() {
  return (
    <tr className="border-b border-ash-100 dark:border-ash-800">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-3 py-3 sm:px-4">
          <Skeleton className="h-5 w-16" />
        </td>
      ))}
    </tr>
  );
}

// Reverse lookup: wagmi chain ID → dexscreener chain string
const WAGMI_TO_DEXSCREENER = Object.fromEntries(
  Object.entries(DEXSCREENER_CHAIN_ID_MAP).map(([dex, wagmi]) => [wagmi, dex])
);

export function LiquidityPairsSection({ filterByChain = false }: { filterByChain?: boolean }) {
  const t = useTranslations("dex");
  const { chain } = useAccount();
  const chainId = chain?.id ?? mainnet.id;
  const { allPairs, isLoading } = useDexScreenerPrices();
  const chainConfig = getChainConfig(chainId);
  const chainName = chainConfig?.chain.name ?? "Ethereum";

  const filteredPairs = useMemo(() => {
    if (!filterByChain) return allPairs;
    const dexChainId = WAGMI_TO_DEXSCREENER[chainId];
    if (!dexChainId) return [];
    return allPairs.filter((pair) => pair.chainId === dexChainId);
  }, [allPairs, filterByChain, chainId]);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ash-900 dark:text-ash-100 sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-ash-500 dark:text-ash-400">
          {filterByChain
            ? `${chainName} — ${t("subtitle")}`
            : t("subtitle")}
        </p>
      </div>

      {/* Desktop table */}
      <Card variant="glow" className="hidden overflow-hidden lg:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ash-200 bg-ash-50/80 dark:border-ash-800 dark:bg-ash-900/50">
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("chain")}
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("pair")}
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("exchange")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("price")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("change_24h")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("volume_24h")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("liquidity")}
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <PairSkeletonRow key={i} />
                  ))
                ) : filteredPairs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-ash-500 dark:text-ash-400"
                    >
                      {t("no_pairs")}
                    </td>
                  </tr>
                ) : (
                  filteredPairs.map((pair) => (
                    <PairRow key={pair.pairAddress} pair={pair} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="glow">
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPairs.length === 0 ? (
          <p className="col-span-full text-center text-sm text-ash-500 dark:text-ash-400">
            {t("no_pairs")}
          </p>
        ) : (
          filteredPairs.map((pair) => (
            <PairCard key={pair.pairAddress} pair={pair} />
          ))
        )}
      </div>
    </section>
  );
}
