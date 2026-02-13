"use client";

import { useAccount } from "wagmi";
import { mainnet } from "wagmi/chains";
import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import {
  Coins,
  Flame,
  Lock,
  TrendingUp,
  Vault,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFenixStats } from "@/hooks/use-fenix-contract";
import { formatEther } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  suffix?: string;
  isLoading: boolean;
}

function StatCard({ icon, label, value, suffix, isLoading }: StatCardProps) {
  return (
    <Card variant="glow" className="group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fenix-500/10 to-ember-500/10 text-fenix-500 dark:from-fenix-500/20 dark:to-ember-500/20">
            {icon}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-ash-500 dark:text-ash-400">
            {label}
          </p>

          {isLoading ? (
            <Skeleton className="mt-1.5 h-7 w-28" />
          ) : (
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-ash-900 dark:text-ash-100">
                {value !== undefined ? (
                  <NumberFlow
                    value={value}
                    format={{
                      notation: value > 1_000_000 ? "compact" : "standard",
                      maximumFractionDigits: 2,
                    }}
                    transformTiming={{
                      duration: 750,
                      easing: "ease-out",
                    }}
                  />
                ) : (
                  "--"
                )}
              </span>
              {suffix && (
                <span className="text-sm font-medium text-ash-400 dark:text-ash-500">
                  {suffix}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid() {
  const t = useTranslations("stats");
  const { chain } = useAccount();
  // Default to Ethereum mainnet when no wallet is connected
  const chainId = chain?.id ?? mainnet.id;
  const {
    totalSupply,
    equityPoolSupply,
    equityPoolTotalShares,
    rewardPoolSupply,
    shareRate,
    isLoading,
  } = useFenixStats(chainId);

  const totalSupplyNum =
    totalSupply !== undefined
      ? parseFloat(formatEther(totalSupply))
      : undefined;

  const equityPoolNum =
    equityPoolSupply !== undefined
      ? parseFloat(formatEther(equityPoolSupply))
      : undefined;

  const rewardPoolNum =
    rewardPoolSupply !== undefined
      ? parseFloat(formatEther(rewardPoolSupply))
      : undefined;

  const shareRateNum =
    shareRate !== undefined ? parseFloat(formatEther(shareRate)) : undefined;

  const totalStakedNum =
    equityPoolTotalShares !== undefined
      ? parseFloat(formatEther(equityPoolTotalShares))
      : undefined;

  const stats: StatCardProps[] = [
    {
      icon: <Flame className="h-5 w-5" />,
      label: t("total_burned"),
      value: totalSupplyNum !== undefined ? totalSupplyNum * 10000 : undefined,
      suffix: "XEN",
      isLoading,
    },
    {
      icon: <Coins className="h-5 w-5" />,
      label: t("total_minted"),
      value: totalSupplyNum,
      suffix: "FENIX",
      isLoading,
    },
    {
      icon: <Lock className="h-5 w-5" />,
      label: t("total_staked"),
      value: totalStakedNum,
      suffix: "Shares",
      isLoading,
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: t("share_rate"),
      value: shareRateNum,
      isLoading,
    },
    {
      icon: <Vault className="h-5 w-5" />,
      label: t("equity_pool"),
      value: equityPoolNum,
      suffix: "FENIX",
      isLoading,
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: t("reward_pool"),
      value: rewardPoolNum,
      suffix: "FENIX",
      isLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
