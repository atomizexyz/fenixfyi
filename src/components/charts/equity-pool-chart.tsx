"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFenixStats } from "@/hooks/use-fenix-contract";
import {
  useAllChainsStats,
  type ChainStats,
} from "@/hooks/use-all-chains-stats";
import { formatEther, formatCompact } from "@/lib/utils";
import { BRAND_COLORS } from "@/config/constants";
import { mainnet } from "wagmi/chains";

const POOL_COLORS = [
  "#F97316", // fenix-500  — equity
  "#EF4444", // ember-500  — reward
  "#F59E0B", // amber-500  — circulating
];

interface ChartEntry {
  name: string;
  value: number;
  fill: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartEntry }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-ash-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-ash-700 dark:bg-ash-900/95">
      <p className="text-xs font-medium text-ash-500 dark:text-ash-400">
        {data.name}
      </p>
      <p className="text-sm font-semibold text-ash-900 dark:text-ash-100">
        {formatCompact(data.value)} FENIX
      </p>
    </div>
  );
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) {
  if (percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function renderMiniLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) {
  if (percent < 0.08) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function buildChartData(
  t: ReturnType<typeof useTranslations>,
  totalSupply?: bigint,
  equityPoolSupply?: bigint,
  rewardPoolSupply?: bigint,
): ChartEntry[] {
  if (equityPoolSupply === undefined || rewardPoolSupply === undefined || totalSupply === undefined) return [];

  const equity = parseFloat(formatEther(equityPoolSupply));
  const reward = parseFloat(formatEther(rewardPoolSupply));
  const circulating = parseFloat(formatEther(totalSupply));

  const entries: ChartEntry[] = [];

  if (equity > 0)
    entries.push({ name: t("equity_pool"), value: equity, fill: POOL_COLORS[0] });
  if (reward > 0)
    entries.push({ name: t("reward_pool"), value: reward, fill: POOL_COLORS[1] });
  if (circulating > 0)
    entries.push({ name: t("circulating"), value: circulating, fill: POOL_COLORS[2] });

  return entries;
}

/* ── Full-size chart (dashboard page) ──────────────────────────── */

interface SupplyChartProps {
  className?: string;
}

export function SupplyChart({ className }: SupplyChartProps) {
  const t = useTranslations("stats");
  const { chain } = useAccount();
  const chainId = chain?.id ?? mainnet.id;
  const { equityPoolSupply, rewardPoolSupply, totalSupply, isLoading } =
    useFenixStats(chainId);

  const data = useMemo<ChartEntry[]>(
    () => buildChartData(t, totalSupply, equityPoolSupply, rewardPoolSupply),
    [equityPoolSupply, rewardPoolSupply, totalSupply, t],
  );

  return (
    <Card variant="glow" className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t("supply_distribution")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center">
            <p className="text-sm text-ash-400 dark:text-ash-500">
              No pool data available
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <defs>
                  <filter id="donutGlow">
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="4"
                      floodColor={BRAND_COLORS.primary}
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  label={renderCustomLabel}
                  labelLine={false}
                  filter="url(#donutGlow)"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {data.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-xs text-ash-600 dark:text-ash-400">
                    <span className="font-medium">{entry.name}</span>
                    {" "}
                    <span className="font-mono">{formatCompact(entry.value)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** @deprecated Use SupplyChart instead */
export const EquityPoolChart = SupplyChart;

/* ── Mini chart card (per-chain, data-driven) ──────────────────── */

function MiniSupplyChart({ stats }: { stats: ChainStats }) {
  const t = useTranslations("stats");
  const { chainConfig, totalSupply, equityPoolSupply, rewardPoolSupply, status } = stats;

  const data = useMemo<ChartEntry[]>(
    () => buildChartData(t, totalSupply, equityPoolSupply, rewardPoolSupply),
    [totalSupply, equityPoolSupply, rewardPoolSupply, t],
  );

  const filterId = `miniGlow-${chainConfig.chain.id}`;

  return (
    <Card variant="glow" className="group">
      <CardContent className="p-4">
        <h3 className="mb-3 text-center text-sm font-semibold text-ash-900 dark:text-ash-100">
          {chainConfig.chain.name}
        </h3>

        {status === "loading" ? (
          <div className="flex h-[160px] items-center justify-center">
            <Skeleton className="h-28 w-28 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center">
            <p className="text-xs text-ash-400 dark:text-ash-500">--</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <defs>
                  <filter id={filterId}>
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="3"
                      floodColor={BRAND_COLORS.primary}
                      floodOpacity="0.25"
                    />
                  </filter>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={58}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  label={renderMiniLabel}
                  labelLine={false}
                  filter={`url(#${filterId})`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1">
              {data.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-[10px] text-ash-500 dark:text-ash-400">
                    {formatCompact(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Grid of per-chain supply charts (landing page) ────────────── */

export function ChainSupplyGrid() {
  const t = useTranslations("stats");
  const { chainsStats } = useAllChainsStats();

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ash-900 dark:text-ash-100 sm:text-3xl">
          {t("supply_distribution")}
        </h2>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {chainsStats.map((stats) => (
          <MiniSupplyChart key={stats.chainConfig.chain.id} stats={stats} />
        ))}
      </div>
    </section>
  );
}
