import { describe, it, expect } from "vitest";
import {
  XEN_TO_FENIX_RATIO,
  INFLATION_RATE,
  MAX_STAKE_DAYS,
  MIN_STAKE_DAYS,
  LATE_PENALTY_DAYS,
  FLUSH_COOLDOWN_WEEKS,
  FLUSH_INTERVAL_WEEKS,
  SECONDS_PER_DAY,
  LOCALES,
  RTL_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
  BRAND_COLORS,
  SOCIAL_LINKS,
} from "@/config/constants";

describe("Protocol Constants", () => {
  it("has correct XEN to FENIX ratio", () => {
    expect(XEN_TO_FENIX_RATIO).toBe(10_000n);
  });

  it("uses golden ratio for inflation rate", () => {
    expect(INFLATION_RATE).toBeCloseTo(1.618034, 5);
  });

  it("has correct stake bounds", () => {
    expect(MIN_STAKE_DAYS).toBe(1);
    expect(MAX_STAKE_DAYS).toBe(7_777);
    expect(MAX_STAKE_DAYS).toBeGreaterThan(MIN_STAKE_DAYS);
  });

  it("has correct late penalty days", () => {
    expect(LATE_PENALTY_DAYS).toBe(180);
  });

  it("has correct flush timing", () => {
    expect(FLUSH_COOLDOWN_WEEKS).toBe(3);
    expect(FLUSH_INTERVAL_WEEKS).toBe(13);
    expect(FLUSH_INTERVAL_WEEKS).toBeGreaterThan(FLUSH_COOLDOWN_WEEKS);
  });

  it("has correct seconds per day", () => {
    expect(SECONDS_PER_DAY).toBe(86_400);
    expect(SECONDS_PER_DAY).toBe(60 * 60 * 24);
  });
});

describe("Locale Configuration", () => {
  it("has 21 supported locales", () => {
    expect(LOCALES).toHaveLength(21);
  });

  it("includes English as default locale", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(LOCALES).toContain("en");
  });

  it("has 3 RTL locales", () => {
    expect(RTL_LOCALES).toHaveLength(3);
    expect(RTL_LOCALES).toContain("ar");
    expect(RTL_LOCALES).toContain("he");
    expect(RTL_LOCALES).toContain("fa");
  });

  it("all RTL locales are in LOCALES", () => {
    for (const rtl of RTL_LOCALES) {
      expect(LOCALES).toContain(rtl);
    }
  });

  it("has display names for all locales", () => {
    for (const locale of LOCALES) {
      expect(LOCALE_NAMES[locale]).toBeDefined();
      expect(LOCALE_NAMES[locale].length).toBeGreaterThan(0);
    }
  });

  it("includes major world languages", () => {
    const major = ["en", "es", "fr", "de", "ja", "ko", "zh", "ar", "hi", "ru"];
    for (const lang of major) {
      expect(LOCALES).toContain(lang);
    }
  });
});

describe("Brand Colors", () => {
  it("has valid hex color values", () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    expect(BRAND_COLORS.primary).toMatch(hexRegex);
    expect(BRAND_COLORS.secondary).toMatch(hexRegex);
    expect(BRAND_COLORS.accent).toMatch(hexRegex);
    expect(BRAND_COLORS.gradient.from).toMatch(hexRegex);
    expect(BRAND_COLORS.gradient.via).toMatch(hexRegex);
    expect(BRAND_COLORS.gradient.to).toMatch(hexRegex);
  });

  it("has rgba glow color", () => {
    expect(BRAND_COLORS.glow).toContain("rgba");
  });
});

describe("Social Links", () => {
  it("has valid URLs", () => {
    for (const [, url] of Object.entries(SOCIAL_LINKS)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("has all required social channels", () => {
    expect(SOCIAL_LINKS.twitter).toBeDefined();
    expect(SOCIAL_LINKS.telegram).toBeDefined();
    expect(SOCIAL_LINKS.github).toBeDefined();
    expect(SOCIAL_LINKS.litepaper).toBeDefined();
    expect(SOCIAL_LINKS.certik).toBeDefined();
    expect(SOCIAL_LINKS.merch).toBeDefined();
  });
});
