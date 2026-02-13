"use client";

import { useTranslations } from "next-intl";
import { Github, ExternalLink } from "lucide-react";
import { FenixLogo, FenixWordmark } from "@/components/icons";
import { SOCIAL_LINKS } from "@/config/constants";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-ash-200/50 bg-ash-50/50 dark:border-ash-800/50 dark:bg-ash-950/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FenixLogo className="h-8 w-8" />
              <FenixWordmark className="h-4 w-auto text-ash-900 dark:text-ash-100" />
            </div>
            <p className="text-sm text-ash-500 dark:text-ash-400">
              {t("copyright")}
            </p>
          </div>

          {/* Protocol */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ash-900 dark:text-ash-100">
              {t("protocol")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/burn"
                  className="text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  Burn
                </Link>
              </li>
              <li>
                <Link
                  href="/stake"
                  className="text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  Stake
                </Link>
              </li>
              <li>
                <Link
                  href="/rewards"
                  className="text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ash-900 dark:text-ash-100">
              {t("resources")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.litepaper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  {t("litepaper")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.certik}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  {t("audit")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.merch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  {t("merch")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ash-900 dark:text-ash-100">
              {t("community")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  <Github className="h-3.5 w-3.5" />
                  {t("github")}
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  {t("twitter")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ash-500 transition-colors hover:text-fenix-500 dark:text-ash-400"
                >
                  {t("telegram")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ash-200 pt-8 dark:border-ash-800">
          <p className="text-center text-xs text-ash-400 dark:text-ash-500">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
