"use client";

import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import {
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllChainsStats,
  type ChainStats,
} from "@/hooks/use-all-chains-stats";
import { formatEther, shortenAddress } from "@/lib/utils";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center text-ash-400 transition-colors hover:text-fenix-500"
      title="Copy address"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

function StatusDot({ status }: { status: ChainStats["status"] }) {
  if (status === "loading") {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ash-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ash-400" />
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>
    );
  }

  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
    </span>
  );
}

function ChainRow({ stats }: { stats: ChainStats }) {
  const { chainConfig, totalSupply, equityPoolSupply, rewardPoolSupply, shareRate, status } =
    stats;
  const chain = chainConfig.chain;

  const equityNum = equityPoolSupply !== undefined
    ? parseFloat(formatEther(equityPoolSupply))
    : undefined;
  const rewardNum = rewardPoolSupply !== undefined
    ? parseFloat(formatEther(rewardPoolSupply))
    : undefined;
  const circulatingNum = totalSupply !== undefined
    ? parseFloat(formatEther(totalSupply))
    : undefined;
  const shareRateNum = shareRate !== undefined
    ? parseFloat(formatEther(shareRate))
    : undefined;

  const explorerUrl = chain.blockExplorers?.default?.url;
  const addressUrl = explorerUrl
    ? `${explorerUrl}/address/${chainConfig.fenixContract}`
    : undefined;

  return (
    <tr className="border-b border-ash-100 transition-colors hover:bg-ash-50/50 dark:border-ash-800 dark:hover:bg-ash-800/30">
      {/* Chain */}
      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ash-900 dark:text-ash-100">
            {chain.name}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-3 sm:px-4">
        <StatusDot status={status} />
      </td>

      {/* Equity Supply */}
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        {status === "loading" ? (
          <Skeleton className="ml-auto h-5 w-20" />
        ) : equityNum !== undefined ? (
          <span className="text-ash-900 dark:text-ash-100">
            <NumberFlow
              value={equityNum}
              format={{
                notation: equityNum > 1_000_000 ? "compact" : "standard",
                maximumFractionDigits: 2,
              }}
              transformTiming={{ duration: 600, easing: "ease-out" }}
            />
          </span>
        ) : (
          <span className="text-ash-400">--</span>
        )}
      </td>

      {/* Reward Supply */}
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        {status === "loading" ? (
          <Skeleton className="ml-auto h-5 w-20" />
        ) : rewardNum !== undefined ? (
          <span className="text-ash-900 dark:text-ash-100">
            <NumberFlow
              value={rewardNum}
              format={{
                notation: rewardNum > 1_000_000 ? "compact" : "standard",
                maximumFractionDigits: 2,
              }}
              transformTiming={{ duration: 600, easing: "ease-out" }}
            />
          </span>
        ) : (
          <span className="text-ash-400">--</span>
        )}
      </td>

      {/* Circulating Supply */}
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        {status === "loading" ? (
          <Skeleton className="ml-auto h-5 w-20" />
        ) : circulatingNum !== undefined ? (
          <span className="text-ash-900 dark:text-ash-100">
            <NumberFlow
              value={circulatingNum}
              format={{
                notation: circulatingNum > 1_000_000 ? "compact" : "standard",
                maximumFractionDigits: 2,
              }}
              transformTiming={{ duration: 600, easing: "ease-out" }}
            />
          </span>
        ) : (
          <span className="text-ash-400">--</span>
        )}
      </td>

      {/* Share Rate */}
      <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-sm sm:px-4">
        {status === "loading" ? (
          <Skeleton className="ml-auto h-5 w-16" />
        ) : shareRateNum !== undefined ? (
          <span className="text-fenix-600 dark:text-fenix-400">
            <NumberFlow
              value={shareRateNum}
              format={{ maximumFractionDigits: 4 }}
              transformTiming={{ duration: 600, easing: "ease-out" }}
            />
          </span>
        ) : (
          <span className="text-ash-400">--</span>
        )}
      </td>

      {/* Address */}
      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-ash-500 dark:text-ash-400">
            {shortenAddress(chainConfig.fenixContract, 4)}
          </span>
          <CopyButton text={chainConfig.fenixContract} />
          {addressUrl && (
            <a
              href={addressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ash-400 transition-colors hover:text-fenix-500"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

// Mobile card view for small screens
function ChainCard({ stats }: { stats: ChainStats }) {
  const t = useTranslations("chain_table");
  const { chainConfig, totalSupply, equityPoolSupply, rewardPoolSupply, shareRate, status } =
    stats;
  const chain = chainConfig.chain;

  const equityNum = equityPoolSupply !== undefined
    ? parseFloat(formatEther(equityPoolSupply))
    : undefined;
  const rewardNum = rewardPoolSupply !== undefined
    ? parseFloat(formatEther(rewardPoolSupply))
    : undefined;
  const circulatingNum = totalSupply !== undefined
    ? parseFloat(formatEther(totalSupply))
    : undefined;
  const shareRateNum = shareRate !== undefined
    ? parseFloat(formatEther(shareRate))
    : undefined;

  const explorerUrl = chain.blockExplorers?.default?.url;
  const addressUrl = explorerUrl
    ? `${explorerUrl}/address/${chainConfig.fenixContract}`
    : undefined;

  return (
    <Card variant="glow" className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ash-900 dark:text-ash-100">
              {chain.name}
            </span>
          </div>
          <StatusDot status={status} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("equity_supply")}
            </p>
            <p className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              {status === "loading" ? (
                <Skeleton className="h-4 w-16" />
              ) : equityNum !== undefined ? (
                <NumberFlow
                  value={equityNum}
                  format={{
                    notation: equityNum > 1_000_000 ? "compact" : "standard",
                    maximumFractionDigits: 2,
                  }}
                  transformTiming={{ duration: 600, easing: "ease-out" }}
                />
              ) : (
                "--"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("reward_supply")}
            </p>
            <p className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              {status === "loading" ? (
                <Skeleton className="h-4 w-16" />
              ) : rewardNum !== undefined ? (
                <NumberFlow
                  value={rewardNum}
                  format={{
                    notation: rewardNum > 1_000_000 ? "compact" : "standard",
                    maximumFractionDigits: 2,
                  }}
                  transformTiming={{ duration: 600, easing: "ease-out" }}
                />
              ) : (
                "--"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("circulating_supply")}
            </p>
            <p className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              {status === "loading" ? (
                <Skeleton className="h-4 w-16" />
              ) : circulatingNum !== undefined ? (
                <NumberFlow
                  value={circulatingNum}
                  format={{
                    notation: circulatingNum > 1_000_000 ? "compact" : "standard",
                    maximumFractionDigits: 2,
                  }}
                  transformTiming={{ duration: 600, easing: "ease-out" }}
                />
              ) : (
                "--"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("share_rate")}
            </p>
            <p className="font-mono text-sm font-semibold text-fenix-600 dark:text-fenix-400">
              {status === "loading" ? (
                <Skeleton className="h-4 w-12" />
              ) : shareRateNum !== undefined ? (
                <NumberFlow
                  value={shareRateNum}
                  format={{ maximumFractionDigits: 4 }}
                  transformTiming={{ duration: 600, easing: "ease-out" }}
                />
              ) : (
                "--"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-ash-500 dark:text-ash-400">
              {t("address")}
            </p>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-ash-600 dark:text-ash-400">
                {shortenAddress(chainConfig.fenixContract, 4)}
              </span>
              <CopyButton text={chainConfig.fenixContract} />
              {addressUrl && (
                <a
                  href={addressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash-400 transition-colors hover:text-fenix-500"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChainTable() {
  const t = useTranslations("chain_table");
  const { chainsStats } = useAllChainsStats();

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ash-900 dark:text-ash-100 sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-ash-500 dark:text-ash-400">
          {t("subtitle")}
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
                    {t("status")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("equity_supply")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("reward_supply")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("circulating_supply")}
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("share_rate")}
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ash-500 dark:text-ash-400 sm:px-4">
                    {t("address")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {chainsStats.map((stats) => (
                  <ChainRow key={stats.chainConfig.chain.id} stats={stats} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {chainsStats.map((stats) => (
          <ChainCard key={stats.chainConfig.chain.id} stats={stats} />
        ))}
      </div>
    </section>
  );
}
