"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ConnectKitButton } from "connectkit";
import { useDisconnect } from "wagmi";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { FenixLogo, FenixWordmark } from "@/components/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChainSelector } from "@/components/wallet/chain-selector";
import { WalletQR } from "@/components/wallet/wallet-qr";
import { LocaleSelector } from "@/components/layout/locale-selector";

function WalletButton() {
  const t = useTranslations("nav");
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleDisconnect = useCallback(() => {
    setMenuOpen(false);
    disconnect();
  }, [disconnect]);

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName, address }) => {
        if (!isConnected) {
          return (
            <button
              onClick={show}
              className="rounded-xl bg-gradient-to-r from-fenix-500 to-ember-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-fenix-500/25 transition-all hover:shadow-fenix-500/40"
            >
              {t("connect")}
            </button>
          );
        }

        return (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl border border-ash-200 bg-white px-4 py-2 text-sm font-medium text-ash-900 transition-all hover:bg-ash-50 dark:border-ash-700 dark:bg-ash-800 dark:text-ash-100 dark:hover:bg-ash-700"
            >
              {ensName || truncatedAddress}
            </button>

            {menuOpen && (
              <div className="absolute end-0 top-full z-50 mt-2 w-52 rounded-xl border border-ash-200 bg-white p-1 shadow-lg dark:border-ash-700 dark:bg-ash-900">
                {address && (
                  <button
                    onClick={() => handleCopy(address)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ash-700 transition-colors hover:bg-ash-100 dark:text-ash-300 dark:hover:bg-ash-800"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy Address"}
                  </button>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    show?.();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ash-700 transition-colors hover:bg-ash-100 dark:text-ash-300 dark:hover:bg-ash-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  Wallet Details
                </button>

                <div className="my-1 border-t border-ash-200 dark:border-ash-700" />

                <button
                  onClick={handleDisconnect}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  {t("disconnect")}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/burn", label: t("burn") },
    { href: "/stake", label: t("stake") },
    { href: "/rewards", label: t("rewards") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-ash-200/50 bg-white/80 backdrop-blur-xl dark:border-ash-800/50 dark:bg-ash-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <FenixLogo className="h-9 w-9" />
          <FenixWordmark className="hidden h-5 w-auto text-ash-900 dark:text-ash-100 sm:block" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-fenix-500/10 text-fenix-600 dark:text-fenix-400"
                  : "text-ash-600 hover:bg-ash-100 hover:text-ash-900 dark:text-ash-400 dark:hover:bg-ash-800 dark:hover:text-ash-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <LocaleSelector />
          <ChainSelector />
          <WalletQR />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-ash-600 transition-colors hover:bg-ash-100 dark:text-ash-400 dark:hover:bg-ash-800"
            aria-label="Toggle theme"
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="block h-4 w-4 dark:hidden" />
          </button>

          <WalletButton />

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-ash-600 md:hidden dark:text-ash-400"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-ash-200 bg-white px-4 py-3 dark:border-ash-800 dark:bg-ash-950 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-fenix-500/10 text-fenix-600 dark:text-fenix-400"
                    : "text-ash-600 hover:bg-ash-100 dark:text-ash-400 dark:hover:bg-ash-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
