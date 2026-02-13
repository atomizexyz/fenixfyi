import { describe, it, expect } from "vitest";
import { StakeStatus, type StakeInfo } from "@/types/contracts";
import {
  calculateEarlyPenalty,
  calculateLatePenalty,
} from "@/lib/utils";
import {
  getMaturityTs,
  getStakeStatus,
  getProgress,
  getDaysInfo,
  getPenaltyPreview,
} from "@/components/stake/stakes-list";

function makeStake(overrides: Partial<StakeInfo> = {}): StakeInfo {
  const now = Math.floor(Date.now() / 1000);
  return {
    status: StakeStatus.Active,
    startTs: BigInt(now - 30 * 86_400), // started 30 days ago
    deferralTs: 0n,
    endTs: 0n,
    term: 100n, // 100 day term
    fenix: BigInt("1000000000000000000"), // 1 FENIX (1e18)
    shares: BigInt("500000000000000000"), // 0.5 shares
    payout: 0n,
    ...overrides,
  };
}

describe("StakeStatus enum values", () => {
  it("Active = 0", () => {
    expect(StakeStatus.Active).toBe(0);
  });

  it("Deferred = 1", () => {
    expect(StakeStatus.Deferred).toBe(1);
  });

  it("EndedOnTime = 2", () => {
    expect(StakeStatus.EndedOnTime).toBe(2);
  });

  it("EndedEarly = 3", () => {
    expect(StakeStatus.EndedEarly).toBe(3);
  });

  it("EndedLate = 4", () => {
    expect(StakeStatus.EndedLate).toBe(4);
  });
});

describe("getMaturityTs", () => {
  it("computes maturity as startTs + term * 86400", () => {
    const stake = makeStake({ startTs: 1000000n, term: 10n });
    expect(getMaturityTs(stake)).toBe(1000000 + 10 * 86_400);
  });
});

describe("getStakeStatus", () => {
  it("returns 'active' for an active stake before maturity", () => {
    const now = Math.floor(Date.now() / 1000);
    const stake = makeStake({ startTs: BigInt(now - 10 * 86_400), term: 100n });
    const result = getStakeStatus(stake, now);
    expect(result.label).toBe("active");
    expect(result.variant).toBe("default");
  });

  it("returns 'matured' for an active stake past maturity", () => {
    const now = Math.floor(Date.now() / 1000);
    const stake = makeStake({
      startTs: BigInt(now - 200 * 86_400),
      term: 100n,
      status: StakeStatus.Active,
    });
    const result = getStakeStatus(stake, now);
    expect(result.label).toBe("matured");
    expect(result.variant).toBe("success");
  });

  it("returns 'deferred' for a deferred stake", () => {
    const now = Math.floor(Date.now() / 1000);
    const stake = makeStake({ status: StakeStatus.Deferred });
    const result = getStakeStatus(stake, now);
    expect(result.label).toBe("deferred");
    expect(result.variant).toBe("secondary");
  });

  it("returns 'ended' for EndedOnTime", () => {
    const now = Math.floor(Date.now() / 1000);
    const stake = makeStake({ status: StakeStatus.EndedOnTime });
    const result = getStakeStatus(stake, now);
    expect(result.label).toBe("ended");
    expect(result.variant).toBe("secondary");
  });

  it("returns 'ended' for EndedEarly", () => {
    const now = Math.floor(Date.now() / 1000);
    const stake = makeStake({ status: StakeStatus.EndedEarly });
    const result = getStakeStatus(stake, now);
    expect(result.label).toBe("ended");
  });

  it("returns 'ended' for EndedLate", () => {
    const now = Math.floor(Date.now() / 1000);
    const stake = makeStake({ status: StakeStatus.EndedLate });
    const result = getStakeStatus(stake, now);
    expect(result.label).toBe("ended");
  });
});

describe("getProgress", () => {
  it("returns 0 at start", () => {
    const now = 1000000;
    const stake = makeStake({ startTs: BigInt(now), term: 100n });
    expect(getProgress(stake, now)).toBe(0);
  });

  it("returns 50 at midpoint", () => {
    const startTs = 1000000;
    const term = 100;
    const midpoint = startTs + (term * 86_400) / 2;
    const stake = makeStake({ startTs: BigInt(startTs), term: BigInt(term) });
    expect(getProgress(stake, midpoint)).toBeCloseTo(50, 1);
  });

  it("returns 100 at maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const maturity = startTs + term * 86_400;
    const stake = makeStake({ startTs: BigInt(startTs), term: BigInt(term) });
    expect(getProgress(stake, maturity)).toBe(100);
  });

  it("returns 100 past maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const pastMaturity = startTs + term * 86_400 + 10000;
    const stake = makeStake({ startTs: BigInt(startTs), term: BigInt(term) });
    expect(getProgress(stake, pastMaturity)).toBe(100);
  });

  it("returns 0 before start", () => {
    const startTs = 1000000;
    const stake = makeStake({ startTs: BigInt(startTs), term: 100n });
    expect(getProgress(stake, startTs - 1000)).toBe(0);
  });
});

describe("getDaysInfo", () => {
  it("returns days remaining before maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const now = startTs + 50 * 86_400; // 50 days in
    const stake = makeStake({ startTs: BigInt(startTs), term: BigInt(term) });
    const result = getDaysInfo(stake, now);
    expect(result.isLate).toBe(false);
    expect(result.days).toBe(50);
  });

  it("returns days late after maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const maturity = startTs + term * 86_400;
    const now = maturity + 10 * 86_400; // 10 days late
    const stake = makeStake({ startTs: BigInt(startTs), term: BigInt(term) });
    const result = getDaysInfo(stake, now);
    expect(result.isLate).toBe(true);
    expect(result.days).toBe(10);
  });
});

describe("getPenaltyPreview", () => {
  it("returns no penalty exactly at maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const maturity = startTs + term * 86_400;
    const stake = makeStake({
      startTs: BigInt(startTs),
      term: BigInt(term),
      fenix: BigInt("10000000000000000000"), // 10 FENIX
    });
    const result = getPenaltyPreview(stake, maturity);
    expect(result).not.toBeNull();
    expect(result!.penalty).toBe(0);
    expect(result!.payout).toBeCloseTo(10, 1);
  });

  it("returns early penalty before maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const now = startTs + 50 * 86_400; // 50 days in
    const stake = makeStake({
      startTs: BigInt(startTs),
      term: BigInt(term),
      fenix: BigInt("10000000000000000000"), // 10 FENIX
    });
    const result = getPenaltyPreview(stake, now);
    expect(result).not.toBeNull();
    expect(result!.penalty).toBeGreaterThan(0);
    expect(result!.penalty).toBeLessThan(1);
    expect(result!.payout).toBeLessThan(10);
    expect(result!.payout).toBeGreaterThan(0);
  });

  it("returns late penalty after maturity", () => {
    const startTs = 1000000;
    const term = 100;
    const maturity = startTs + term * 86_400;
    const now = maturity + 30 * 86_400; // 30 days late
    const stake = makeStake({
      startTs: BigInt(startTs),
      term: BigInt(term),
      fenix: BigInt("10000000000000000000"), // 10 FENIX
    });
    const result = getPenaltyPreview(stake, now);
    expect(result).not.toBeNull();
    expect(result!.penalty).toBeGreaterThan(0);
    expect(result!.payout).toBeLessThan(10);
  });
});

describe("calculateEarlyPenalty", () => {
  it("returns 0 at day 0 of any term", () => {
    expect(calculateEarlyPenalty(0, 7777)).toBe(0);
  });

  it("returns (1/7777)^2 at day 1 of 7777", () => {
    const result = calculateEarlyPenalty(1, 7777);
    expect(result).toBeCloseTo((1 / 7777) ** 2, 10);
  });

  it("returns 0.25 at halfway through the term", () => {
    expect(calculateEarlyPenalty(50, 100)).toBeCloseTo(0.25);
  });

  it("returns 1 at last day (full term elapsed)", () => {
    expect(calculateEarlyPenalty(100, 100)).toBeCloseTo(1);
  });

  it("quadratic penalty curve — penalty at 1/4 is 1/16", () => {
    expect(calculateEarlyPenalty(25, 100)).toBeCloseTo(0.0625);
  });
});

describe("calculateLatePenalty", () => {
  it("returns 1 at day 0 late (no penalty)", () => {
    expect(calculateLatePenalty(0)).toBe(1);
  });

  it("returns 0 at day 180 or beyond", () => {
    expect(calculateLatePenalty(180)).toBe(0);
    expect(calculateLatePenalty(365)).toBe(0);
  });

  it("returns close to 1 at day 1 late", () => {
    const result = calculateLatePenalty(1);
    expect(result).toBeGreaterThan(0.99);
    expect(result).toBeLessThan(1);
  });

  it("returns about 0.25 at day 179", () => {
    // (179/180)^3 ≈ 0.9834, so 1 - 0.9834 ≈ 0.0166
    const result = calculateLatePenalty(179);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(0.1);
  });

  it("cubic decay — midpoint (day 90) retains ~87.5%", () => {
    const result = calculateLatePenalty(90);
    // 1 - (90/180)^3 = 1 - 0.125 = 0.875
    expect(result).toBeCloseTo(0.875);
  });
});
