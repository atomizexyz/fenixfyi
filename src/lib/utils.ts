import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number | bigint,
  options?: Intl.NumberFormatOptions
): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    ...options,
  }).format(num);
}

export function formatEther(wei: bigint, decimals = 18): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = wei / divisor;
  const remainder = wei % divisor;
  const fracStr = remainder.toString().padStart(decimals, "0").slice(0, 4);
  return `${whole.toString()}.${fracStr}`;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function shortenAddress(
  address: string,
  chars = 4
): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function daysToSeconds(days: number): number {
  return days * 86_400;
}

export function secondsToDays(seconds: number): number {
  return Math.floor(seconds / 86_400);
}

export function calculateTimeBonus(term: number): number {
  return 1 + term / 7777;
}

export function calculateSizeBonus(fenix: number): number {
  return 1 - 1 / (fenix + 1);
}

export function calculateTotalBonus(term: number, fenix: number): number {
  const tau = calculateTimeBonus(term);
  const sigma = calculateSizeBonus(fenix);
  return sigma * Math.exp(tau);
}

export function calculateEarlyPenalty(
  elapsedDays: number,
  totalTermDays: number
): number {
  const ratio = elapsedDays / totalTermDays;
  return ratio * ratio;
}

export function formatUsd(value: number): string {
  if (value >= 1_000_000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 0.01 ? 6 : 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function calculateLatePenalty(lateDays: number): number {
  if (lateDays >= 180) return 0;
  const ratio = lateDays / 180;
  return 1 - ratio * ratio * ratio;
}

export function calculateInflation(
  fenix: number,
  termDays: number
): number {
  const inflationRate = 1.618033988749894848;
  return fenix * Math.pow(1 + inflationRate / 100, termDays / 366);
}
