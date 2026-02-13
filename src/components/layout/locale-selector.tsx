"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/config/constants";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function LocaleSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLocaleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-ash-600 transition-colors hover:bg-ash-100 dark:text-ash-400 dark:hover:bg-ash-800"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 max-h-80 w-48 overflow-y-auto rounded-xl border border-ash-200 bg-white p-1 shadow-lg dark:border-ash-700 dark:bg-ash-900">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => handleLocaleChange(l)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                l === locale
                  ? "bg-fenix-500/10 text-fenix-600 dark:text-fenix-400"
                  : "text-ash-700 hover:bg-ash-100 dark:text-ash-300 dark:hover:bg-ash-800"
              )}
            >
              <span>{LOCALE_NAMES[l]}</span>
              <span className="text-xs text-ash-400">{l.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
