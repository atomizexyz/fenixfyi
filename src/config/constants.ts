// Protocol constants
export const XEN_TO_FENIX_RATIO = 10_000n;
export const INFLATION_RATE = 1.618033988749894848;
export const MAX_STAKE_DAYS = 7_777;
export const MIN_STAKE_DAYS = 1;
export const LATE_PENALTY_DAYS = 180;
export const FLUSH_COOLDOWN_WEEKS = 3;
export const FLUSH_INTERVAL_WEEKS = 13;
export const SECONDS_PER_DAY = 86_400;

// Brand colors
export const BRAND_COLORS = {
  primary: "#F97316", // Orange - fire/phoenix theme
  secondary: "#EF4444", // Red
  accent: "#F59E0B", // Amber
  gradient: {
    from: "#F97316",
    via: "#EF4444",
    to: "#DC2626",
  },
  glow: "rgba(249, 115, 22, 0.4)",
} as const;

// Social links
export const SOCIAL_LINKS = {
  twitter: "https://x.com/fenix_protocol",
  telegram: "https://t.me/fenix_protocol",
  github: "https://github.com/atomizexyz",
  litepaper: "https://github.com/atomizexyz/litepaper",
  certik: "https://skynet.certik.com/projects/fenix",
  merch: "https://xenmerch.store/collection/fenix/",
} as const;

// Supported locales
export const LOCALES = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ja",
  "ko",
  "zh",
  "ar",
  "hi",
  "ru",
  "tr",
  "vi",
  "th",
  "id",
  "pl",
  "nl",
  "uk",
  "he",
  "fa",
] as const;

export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar", "he", "fa"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
  de: "Deutsch",
  it: "Italiano",
  pt: "Portugues",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  ar: "العربية",
  hi: "हिन्दी",
  ru: "Русский",
  tr: "Turkce",
  vi: "Tieng Viet",
  th: "ไทย",
  id: "Bahasa Indonesia",
  pl: "Polski",
  nl: "Nederlands",
  uk: "Yкраїнська",
  he: "עברית",
  fa: "فارسی",
};
