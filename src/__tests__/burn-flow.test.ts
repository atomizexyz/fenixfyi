import { describe, it, expect } from "vitest";
import { parseEther } from "viem";
import { XEN_TO_FENIX_RATIO } from "@/config/constants";
import { FENIX_CHAINS } from "@/config/chains";

// Pure logic mirrors from burn-form.tsx

function needsApproval(amount: string, allowance: bigint | undefined): boolean {
  if (!amount || !allowance) return true;
  try {
    const amountWei = parseEther(amount);
    return allowance < amountWei;
  } catch {
    return true;
  }
}

function isValidAmount(amount: string, balance: bigint | undefined): boolean {
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) return false;
  if (!balance) return false;
  try {
    const amountWei = parseEther(amount);
    return amountWei <= balance;
  } catch {
    return false;
  }
}

function fenixReceived(amount: string): number {
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) return 0;
  return parsed / Number(XEN_TO_FENIX_RATIO);
}

describe("Burn flow — needsApproval", () => {
  it("returns true when allowance is undefined", () => {
    expect(needsApproval("100", undefined)).toBe(true);
  });

  it("returns true when amount is empty", () => {
    expect(needsApproval("", 1000n)).toBe(true);
  });

  it("returns true when allowance < amount", () => {
    const allowance = parseEther("50");
    expect(needsApproval("100", allowance)).toBe(true);
  });

  it("returns false when allowance >= amount", () => {
    const allowance = parseEther("200");
    expect(needsApproval("100", allowance)).toBe(false);
  });

  it("returns false when allowance == amount", () => {
    const allowance = parseEther("100");
    expect(needsApproval("100", allowance)).toBe(false);
  });
});

describe("Burn flow — isValidAmount", () => {
  const balance = parseEther("10000");

  it("returns false for 0", () => {
    expect(isValidAmount("0", balance)).toBe(false);
  });

  it("returns false for negative", () => {
    expect(isValidAmount("-1", balance)).toBe(false);
  });

  it("returns false for NaN", () => {
    expect(isValidAmount("abc", balance)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidAmount("", balance)).toBe(false);
  });

  it("returns false when exceeds balance", () => {
    expect(isValidAmount("20000", balance)).toBe(false);
  });

  it("returns false when balance is undefined", () => {
    expect(isValidAmount("100", undefined)).toBe(false);
  });

  it("returns true for valid amount within balance", () => {
    expect(isValidAmount("5000", balance)).toBe(true);
  });

  it("returns true for exact balance", () => {
    expect(isValidAmount("10000", balance)).toBe(true);
  });

  it("returns true for small decimal", () => {
    expect(isValidAmount("0.0001", balance)).toBe(true);
  });
});

describe("Burn flow — fenixReceived", () => {
  it("returns 0 for empty string", () => {
    expect(fenixReceived("")).toBe(0);
  });

  it("returns 0 for '0'", () => {
    expect(fenixReceived("0")).toBe(0);
  });

  it("returns 0 for NaN input", () => {
    expect(fenixReceived("abc")).toBe(0);
  });

  it("calculates correctly: 10000 XEN = 1 FENIX", () => {
    expect(fenixReceived("10000")).toBe(1);
  });

  it("calculates correctly: 50000 XEN = 5 FENIX", () => {
    expect(fenixReceived("50000")).toBe(5);
  });

  it("handles '0.0001' (very small amount)", () => {
    expect(fenixReceived("0.0001")).toBeCloseTo(0.00000001);
  });

  it("handles very large numbers", () => {
    expect(fenixReceived("1000000000")).toBe(100000);
  });
});

describe("Burn flow — per-chain contract addresses", () => {
  it("Evmos has a unique FENIX contract address", () => {
    const evmos = FENIX_CHAINS.find((c) => c.chain.name === "Evmos");
    const mainnet = FENIX_CHAINS.find((c) => c.chain.id === 1);
    expect(evmos).toBeDefined();
    expect(mainnet).toBeDefined();
    expect(evmos!.fenixContract).not.toBe(mainnet!.fenixContract);
  });

  it("Base has a unique FENIX contract address", () => {
    const base = FENIX_CHAINS.find((c) => c.iconSlug === "base");
    const mainnet = FENIX_CHAINS.find((c) => c.chain.id === 1);
    expect(base).toBeDefined();
    expect(mainnet).toBeDefined();
    expect(base!.fenixContract).not.toBe(mainnet!.fenixContract);
  });

  it("most chains share the same FENIX contract address", () => {
    const shared = FENIX_CHAINS.filter(
      (c) => c.iconSlug !== "evmos" && c.iconSlug !== "base"
    );
    const addresses = new Set(shared.map((c) => c.fenixContract));
    expect(addresses.size).toBe(1);
  });
});
