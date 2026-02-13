import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatEther,
  formatCompact,
  shortenAddress,
  daysToSeconds,
  secondsToDays,
  calculateTimeBonus,
  calculateSizeBonus,
  calculateTotalBonus,
  calculateEarlyPenalty,
  calculateLatePenalty,
  calculateInflation,
} from "@/lib/utils";

describe("formatNumber", () => {
  it("formats integers", () => {
    expect(formatNumber(1000)).toBe("1,000");
  });

  it("formats decimals with default precision", () => {
    expect(formatNumber(1234.567)).toBe("1,234.57");
  });

  it("formats bigint", () => {
    expect(formatNumber(1000000n)).toBe("1,000,000");
  });
});

describe("formatEther", () => {
  it("formats wei to ether with 4 decimal places", () => {
    const result = formatEther(1000000000000000000n);
    expect(result).toBe("1.0000");
  });

  it("formats zero", () => {
    expect(formatEther(0n)).toBe("0.0000");
  });

  it("formats fractional amounts", () => {
    const result = formatEther(500000000000000000n);
    expect(result).toBe("0.5000");
  });
});

describe("formatCompact", () => {
  it("formats thousands", () => {
    expect(formatCompact(1500)).toBe("1.5K");
  });

  it("formats millions", () => {
    expect(formatCompact(2500000)).toBe("2.5M");
  });
});

describe("shortenAddress", () => {
  it("shortens ethereum address", () => {
    const addr = "0x1234567890abcdef1234567890abcdef12345678";
    expect(shortenAddress(addr)).toBe("0x1234...5678");
  });

  it("supports custom char count", () => {
    const addr = "0x1234567890abcdef1234567890abcdef12345678";
    expect(shortenAddress(addr, 6)).toBe("0x123456...345678");
  });
});

describe("daysToSeconds / secondsToDays", () => {
  it("converts days to seconds", () => {
    expect(daysToSeconds(1)).toBe(86_400);
    expect(daysToSeconds(7)).toBe(604_800);
  });

  it("converts seconds to days", () => {
    expect(secondsToDays(86_400)).toBe(1);
    expect(secondsToDays(604_800)).toBe(7);
  });

  it("rounds down partial days", () => {
    expect(secondsToDays(90_000)).toBe(1);
  });
});

describe("calculateTimeBonus", () => {
  it("returns 1 for 0 days", () => {
    expect(calculateTimeBonus(0)).toBe(1);
  });

  it("returns 2 for max days", () => {
    expect(calculateTimeBonus(7777)).toBe(2);
  });

  it("returns correct value for 365 days", () => {
    const result = calculateTimeBonus(365);
    expect(result).toBeCloseTo(1.0469, 3);
  });
});

describe("calculateSizeBonus", () => {
  it("returns 0 for 0 fenix", () => {
    expect(calculateSizeBonus(0)).toBe(0);
  });

  it("approaches 1 for large amounts", () => {
    const result = calculateSizeBonus(1000000);
    expect(result).toBeGreaterThan(0.999);
    expect(result).toBeLessThan(1);
  });

  it("returns 0.5 for 1 fenix", () => {
    expect(calculateSizeBonus(1)).toBe(0.5);
  });
});

describe("calculateTotalBonus", () => {
  it("returns 0 for 0 fenix regardless of term", () => {
    expect(calculateTotalBonus(7777, 0)).toBe(0);
  });

  it("increases with longer terms", () => {
    const short = calculateTotalBonus(30, 100);
    const long = calculateTotalBonus(365, 100);
    expect(long).toBeGreaterThan(short);
  });

  it("increases with larger amounts", () => {
    const small = calculateTotalBonus(365, 10);
    const large = calculateTotalBonus(365, 1000);
    expect(large).toBeGreaterThan(small);
  });
});

describe("calculateEarlyPenalty", () => {
  it("returns 0 at start", () => {
    expect(calculateEarlyPenalty(0, 100)).toBe(0);
  });

  it("returns 1 at end", () => {
    expect(calculateEarlyPenalty(100, 100)).toBe(1);
  });

  it("returns ~0.5 at ~71% through", () => {
    const result = calculateEarlyPenalty(71, 100);
    expect(result).toBeCloseTo(0.5, 1);
  });
});

describe("calculateLatePenalty", () => {
  it("returns 1 on day 0 late", () => {
    expect(calculateLatePenalty(0)).toBe(1);
  });

  it("returns 0 at day 180", () => {
    expect(calculateLatePenalty(180)).toBe(0);
  });

  it("retains ~50% around day 143", () => {
    const result = calculateLatePenalty(143);
    expect(result).toBeCloseTo(0.5, 0);
  });
});

describe("calculateInflation", () => {
  it("returns 0 for 0 fenix", () => {
    expect(calculateInflation(0, 365)).toBe(0);
  });

  it("returns correct inflation for 1 year", () => {
    const result = calculateInflation(1000, 366);
    expect(result).toBeCloseTo(1016.18, 0);
  });

  it("increases with longer terms", () => {
    const short = calculateInflation(1000, 30);
    const long = calculateInflation(1000, 365);
    expect(long).toBeGreaterThan(short);
  });
});
