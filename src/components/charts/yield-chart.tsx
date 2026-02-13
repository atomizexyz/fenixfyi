"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateTotalBonus,
  calculateInflation,
  formatCompact,
} from "@/lib/utils";
import { BRAND_COLORS } from "@/config/constants";

interface YieldChartProps {
  amount: number;
  term: number;
  className?: string;
}

interface DataPoint {
  day: number;
  yield: number;
  bonus: number;
  inflation: number;
}

function generateYieldData(amount: number, term: number): DataPoint[] {
  if (amount <= 0 || term <= 0) return [];

  const points: DataPoint[] = [];
  const steps = Math.min(term, 50);
  const stepSize = Math.max(1, Math.floor(term / steps));

  for (let day = 0; day <= term; day += stepSize) {
    const currentTerm = Math.max(day, 1);
    const bonus = calculateTotalBonus(currentTerm, amount);
    const inflation = calculateInflation(amount, currentTerm);
    const yieldValue = inflation * bonus;

    points.push({
      day: currentTerm,
      yield: parseFloat(yieldValue.toFixed(4)),
      bonus: parseFloat(bonus.toFixed(4)),
      inflation: parseFloat(inflation.toFixed(4)),
    });
  }

  // Ensure the final day is included
  if (points.length > 0 && points[points.length - 1].day !== term) {
    const bonus = calculateTotalBonus(term, amount);
    const inflation = calculateInflation(amount, term);
    const yieldValue = inflation * bonus;

    points.push({
      day: term,
      yield: parseFloat(yieldValue.toFixed(4)),
      bonus: parseFloat(bonus.toFixed(4)),
      inflation: parseFloat(inflation.toFixed(4)),
    });
  }

  return points;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-ash-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-ash-700 dark:bg-ash-900/95">
      <p className="text-xs font-medium text-ash-500 dark:text-ash-400">
        Day {label}
      </p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatCompact(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function YieldChart({ amount, term, className }: YieldChartProps) {

  const data = useMemo(
    () => generateYieldData(amount, term),
    [amount, term]
  );

  const hasData = data.length > 0;

  return (
    <Card variant="glow" className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Projected Yield
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[280px] items-center justify-center">
            <p className="text-sm text-ash-400 dark:text-ash-500">
              Enter an amount and term to see projected yield
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={BRAND_COLORS.primary}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="50%"
                    stopColor={BRAND_COLORS.secondary}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor={BRAND_COLORS.secondary}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="yieldStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={BRAND_COLORS.primary} />
                  <stop offset="100%" stopColor={BRAND_COLORS.secondary} />
                </linearGradient>
                <filter id="yieldGlow">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="3"
                    floodColor={BRAND_COLORS.primary}
                    floodOpacity="0.5"
                  />
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-ash-200 dark:text-ash-800"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-ash-400 dark:text-ash-500"
                tickFormatter={(value) =>
                  value >= 365
                    ? `${(value / 365).toFixed(1)}y`
                    : `${value}d`
                }
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-ash-400 dark:text-ash-500"
                tickFormatter={(value) => formatCompact(value)}
                width={55}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="yield"
                name="Yield"
                stroke="url(#yieldStroke)"
                strokeWidth={2.5}
                fill="url(#yieldGradient)"
                filter="url(#yieldGlow)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: BRAND_COLORS.primary,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
