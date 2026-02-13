"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import { ArrowDown, CheckCircle, AlertCircle, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useBurnXen,
  useApproveXen,
  useXenBalance,
  useXenAllowance,
} from "@/hooks/use-fenix-contract";
import { getChainConfig } from "@/config/chains";
import { formatEther } from "@/lib/utils";
import { XEN_TO_FENIX_RATIO } from "@/config/constants";
import { parseEther } from "viem";

export function BurnForm() {
  const t = useTranslations("burn");
  const { chain, isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  const { data: xenBalance, isLoading: isBalanceLoading, refetch: refetchBalance } = useXenBalance(chain?.id);
  const { data: xenAllowance, refetch: refetchAllowance } = useXenAllowance(chain?.id);

  const {
    burn,
    isPending: isBurnPending,
    isConfirming: isBurnConfirming,
    isSuccess: isBurnSuccess,
    error: burnError,
  } = useBurnXen();

  const {
    approve,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useApproveXen();

  // Refetch allowance after successful approval
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Reset amount and refetch balances after successful burn
  useEffect(() => {
    if (isBurnSuccess) {
      setAmount("");
      refetchBalance();
      refetchAllowance();
    }
  }, [isBurnSuccess, refetchBalance, refetchAllowance]);

  const balanceFormatted = useMemo(() => {
    if (!xenBalance) return "0";
    return formatEther(xenBalance as bigint);
  }, [xenBalance]);

  const fenixReceived = useMemo(() => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return 0;
    return parsed / Number(XEN_TO_FENIX_RATIO);
  }, [amount]);

  const needsApproval = useMemo(() => {
    if (!amount || !xenAllowance) return true;
    try {
      const amountWei = parseEther(amount);
      return (xenAllowance as bigint) < amountWei;
    } catch {
      return true;
    }
  }, [amount, xenAllowance]);

  const isValidAmount = useMemo(() => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return false;
    if (!xenBalance) return false;
    try {
      const amountWei = parseEther(amount);
      return amountWei <= (xenBalance as bigint);
    } catch {
      return false;
    }
  }, [amount, xenBalance]);

  const handleMax = useCallback(() => {
    if (xenBalance) {
      setAmount(formatEther(xenBalance as bigint));
    }
  }, [xenBalance]);

  const handleApprove = useCallback(() => {
    if (!chain?.id || !amount) return;
    approve(chain.id, amount);
  }, [chain?.id, amount, approve]);

  const handleBurn = useCallback(() => {
    if (!chain?.id || !amount) return;
    burn(chain.id, amount);
  }, [chain?.id, amount, burn]);

  const isProcessing = isBurnPending || isBurnConfirming || isApprovePending || isApproveConfirming;
  const chainSupported = chain?.id ? !!getChainConfig(chain.id) : false;

  return (
    <Card variant="glow" className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-fenix-500" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* XEN Input */}
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
                    format={{ maximumFractionDigits: 2 }}
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
              disabled={isProcessing || !xenBalance}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs font-bold text-fenix-500 hover:text-fenix-600"
            >
              {t("max")}
            </Button>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ash-200 bg-white dark:border-ash-700 dark:bg-ash-900">
            <ArrowDown className="h-4 w-4 text-ash-400" />
          </div>
        </div>

        {/* FENIX Output */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ash-700 dark:text-ash-300">
            {t("receive_label")}
          </label>
          <div className="flex h-12 items-center rounded-lg border border-ash-200 bg-ash-50 px-4 dark:border-ash-700 dark:bg-ash-800/50">
            <span className="font-mono text-lg font-semibold text-ash-900 dark:text-ash-100">
              <NumberFlow
                value={fenixReceived}
                format={{ maximumFractionDigits: 4 }}
                transformTiming={{ duration: 400, easing: "ease-out" }}
              />
            </span>
            <span className="ml-2 text-sm font-medium text-ash-500 dark:text-ash-400">
              FENIX
            </span>
          </div>
          <p className="text-xs text-ash-400 dark:text-ash-500">{t("ratio")}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {needsApproval && isValidAmount ? (
            <Button
              className="w-full"
              size="lg"
              onClick={handleApprove}
              loading={isApprovePending || isApproveConfirming}
              disabled={!isConnected || !chainSupported || isProcessing}
            >
              {isApproveConfirming
                ? "Confirming..."
                : isApprovePending
                  ? "Approving..."
                  : t("approve")}
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleBurn}
              loading={isBurnPending || isBurnConfirming}
              disabled={!isConnected || !chainSupported || !isValidAmount || isProcessing}
            >
              {isBurnConfirming
                ? "Confirming..."
                : isBurnPending
                  ? "Burning..."
                  : t("burn_button")}
            </Button>
          )}
        </div>

        {/* Status messages */}
        {isBurnSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>
              {t("success", {
                xen: parseFloat(amount).toLocaleString(),
                fenix: fenixReceived.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                }),
              })}
            </span>
          </div>
        )}

        {isApproveSuccess && needsApproval && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Approval confirmed. You can now burn.</span>
          </div>
        )}

        {isConnected && !chainSupported && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Please switch to a supported network</span>
          </div>
        )}

        {(burnError || approveError) && (
          <div className="flex items-start gap-2 rounded-lg border border-ember-200 bg-ember-50 p-3 text-sm text-ember-700 dark:border-ember-800 dark:bg-ember-950/30 dark:text-ember-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="break-all">
              {(approveError as unknown as { shortMessage?: string })?.shortMessage ?? (burnError as unknown as { shortMessage?: string })?.shortMessage ?? (approveError?.message || burnError?.message || t("error"))}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
