"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import {
  Lock,
  Clock,
  Maximize2,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useStartStake, useFenixBalance } from "@/hooks/use-fenix-contract";
import {
  formatEther,
  cn,
  calculateTimeBonus,
  calculateSizeBonus,
  calculateTotalBonus,
  calculateInflation,
} from "@/lib/utils";
import { MAX_STAKE_DAYS, MIN_STAKE_DAYS } from "@/config/constants";
import { parseEther } from "viem";

const TERM_MARKERS = [
  { value: 1, label: "1d" },
  { value: 90, label: "90d" },
  { value: 365, label: "1y" },
  { value: 1825, label: "5y" },
  { value: 3650, label: "10y" },
  { value: 7777, label: "Max" },
];

interface BonusRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}

function BonusRow({ icon, label, value, suffix = "x" }: BonusRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-ash-600 dark:text-ash-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
        <NumberFlow
          value={value}
          format={{ maximumFractionDigits: 4 }}
          transformTiming={{ duration: 400, easing: "ease-out" }}
        />
        {suffix}
      </span>
    </div>
  );
}

export function StakeForm() {
  const t = useTranslations("stake");
  const { chain, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState(365);

  const { data: fenixBalance, isLoading: isBalanceLoading } = useFenixBalance(chain?.id);

  const {
    startStake,
    isPending,
    isConfirming,
    isSuccess,
    error,
  } = useStartStake();

  // Reset form on successful stake
  useEffect(() => {
    if (isSuccess) {
      setAmount("");
      setTerm(365);
    }
  }, [isSuccess]);

  const balanceFormatted = useMemo(() => {
    if (!fenixBalance) return "0";
    return formatEther(fenixBalance as bigint);
  }, [fenixBalance]);

  const parsedAmount = useMemo(() => {
    const val = parseFloat(amount);
    return isNaN(val) || val <= 0 ? 0 : val;
  }, [amount]);

  const timeBonus = useMemo(() => calculateTimeBonus(term), [term]);
  const sizeBonus = useMemo(
    () => calculateSizeBonus(parsedAmount),
    [parsedAmount]
  );
  const totalBonus = useMemo(
    () => calculateTotalBonus(term, parsedAmount),
    [term, parsedAmount]
  );
  const inflationReward = useMemo(
    () => calculateInflation(parsedAmount, term),
    [parsedAmount, term]
  );
  const estimatedShares = useMemo(
    () => (parsedAmount > 0 ? parsedAmount * totalBonus : 0),
    [parsedAmount, totalBonus]
  );

  const isValidAmount = useMemo(() => {
    if (parsedAmount <= 0) return false;
    if (!fenixBalance) return false;
    try {
      const amountWei = parseEther(amount);
      return amountWei <= (fenixBalance as bigint);
    } catch {
      return false;
    }
  }, [amount, parsedAmount, fenixBalance]);

  const handleMax = useCallback(() => {
    if (fenixBalance) {
      setAmount(formatEther(fenixBalance as bigint));
    }
  }, [fenixBalance]);

  const handleStake = useCallback(() => {
    if (!chain?.id || !amount) return;
    startStake(chain.id, amount, term);
  }, [chain?.id, amount, term, startStake]);

  const isProcessing = isPending || isConfirming;

  return (
    <Card variant="glow" className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-fenix-500" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* FENIX Amount Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ash-700 dark:text-ash-300">
              {t("amount_label")}
            </label>
            <div className="flex items-center gap-1.5 text-xs text-ash-500 dark:text-ash-400">
              <span>{t("balance")}:</span>
              {isBalanceLoading ? (
                <Skeleton className="h-3.5 w-16" />
              ) : (
                <span className="font-mono font-medium">
                  <NumberFlow
                    value={parseFloat(balanceFormatted)}
                    format={{ maximumFractionDigits: 4 }}
                    transformTiming={{ duration: 400, easing: "ease-out" }}
                  />
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              inputMode="decimal"
              placeholder={t("amount_placeholder")}
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(val) || val === "") {
                  setAmount(val);
                }
              }}
              className="pr-20 font-mono text-lg"
              disabled={isProcessing}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMax}
              disabled={isProcessing || !fenixBalance}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs font-bold text-fenix-500 hover:text-fenix-600"
            >
              {t("max")}
            </Button>
          </div>
        </div>

        {/* Term Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ash-700 dark:text-ash-300">
              {t("term_label")}
            </label>
            <span className="rounded-md bg-fenix-500/10 px-2 py-0.5 font-mono text-sm font-semibold text-fenix-600 dark:text-fenix-400">
              {t("term_days", { days: term.toLocaleString() })}
            </span>
          </div>

          <Slider
            min={MIN_STAKE_DAYS}
            max={MAX_STAKE_DAYS}
            step={1}
            value={term}
            onChange={(e) => setTerm(parseInt(e.target.value, 10))}
            disabled={isProcessing}
          />

          <div className="flex justify-between px-0.5">
            {TERM_MARKERS.map((marker) => (
              <button
                key={marker.value}
                onClick={() => setTerm(marker.value)}
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                  term === marker.value
                    ? "bg-fenix-500/10 text-fenix-600 dark:text-fenix-400"
                    : "text-ash-400 hover:text-ash-600 dark:text-ash-500 dark:hover:text-ash-300"
                )}
              >
                {marker.label}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-[11px] text-ash-400 dark:text-ash-500">
            <span>{t("min_term")}</span>
            <span>{t("max_term")}</span>
          </div>
        </div>

        {/* Bonus Preview */}
        <div className="space-y-3 rounded-xl border border-ash-200 bg-ash-50/50 p-4 dark:border-ash-800 dark:bg-ash-800/30">
          <h4 className="text-sm font-semibold text-ash-700 dark:text-ash-300">
            {t("bonus_preview")}
          </h4>

          <div className="space-y-2.5">
            <BonusRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label={t("time_bonus")}
              value={timeBonus}
            />
            <BonusRow
              icon={<Maximize2 className="h-3.5 w-3.5" />}
              label={t("size_bonus")}
              value={sizeBonus}
            />

            <div className="my-1 border-t border-ash-200 dark:border-ash-700" />

            <BonusRow
              icon={<Sparkles className="h-3.5 w-3.5 text-fenix-500" />}
              label={t("total_bonus")}
              value={totalBonus}
            />
          </div>
        </div>

        {/* Estimated Outcomes */}
        <div className="space-y-2.5 rounded-xl border border-ash-200 bg-ash-50/50 p-4 dark:border-ash-800 dark:bg-ash-800/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ash-600 dark:text-ash-400">
              {t("shares_estimate")}
            </span>
            <span className="font-mono text-sm font-semibold text-ash-900 dark:text-ash-100">
              <NumberFlow
                value={estimatedShares}
                format={{ maximumFractionDigits: 2 }}
                transformTiming={{ duration: 400, easing: "ease-out" }}
              />
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-ash-600 dark:text-ash-400">
              {t("inflation_estimate")}
            </span>
            <span className="font-mono text-sm font-semibold text-fenix-600 dark:text-fenix-400">
              <NumberFlow
                value={inflationReward}
                format={{ maximumFractionDigits: 4 }}
                transformTiming={{ duration: 400, easing: "ease-out" }}
              />{" "}
              FENIX
            </span>
          </div>
        </div>

        {/* Stake Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleStake}
          loading={isProcessing}
          disabled={!isConnected || !isValidAmount || isProcessing}
        >
          {isConfirming
            ? t("confirming")
            : isPending
              ? t("staking")
              : t("stake_button")}
        </Button>

        {/* Status Messages */}
        {isSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>
              {t("success", {
                amount: parseFloat(amount).toLocaleString(),
                term: term.toLocaleString(),
              })}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-ember-200 bg-ember-50 p-3 text-sm text-ember-700 dark:border-ember-800 dark:bg-ember-950/30 dark:text-ember-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{t("error")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
