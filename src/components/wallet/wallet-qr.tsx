"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";
import { Cuer } from "cuer";
import { QrCode, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FenixLogo } from "@/components/icons";
import { cn, shortenAddress } from "@/lib/utils";

export function WalletQR() {
  const t = useTranslations("common");
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-ash-600 dark:text-ash-400"
        aria-label="Show QR code"
      >
        <QrCode className="h-4 w-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-ash-200 bg-white p-6 shadow-2xl dark:border-ash-700 dark:bg-ash-900">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute end-4 top-4 rounded-lg p-1 text-ash-400 transition-colors hover:bg-ash-100 hover:text-ash-600 dark:hover:bg-ash-800 dark:hover:text-ash-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center gap-5">
              {/* Title */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-ash-900 dark:text-ash-100">
                  Wallet Address
                </h3>
                <p className="mt-1 text-sm text-ash-500 dark:text-ash-400">
                  Scan to send tokens to this address
                </p>
              </div>

              {/* QR Code */}
              <div className="rounded-2xl bg-white p-4 shadow-inner dark:bg-white">
                <Cuer
                  value={address}
                  size={220}
                  color="#1a1a1a"
                  arena={
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-fenix-500 to-ember-500">
                      <FenixLogo className="h-5 w-5" />
                    </div>
                  }
                >
                  <Cuer.Finder radius={0.5} />
                  <Cuer.Cells radius={1} />
                </Cuer>
              </div>

              {/* Address + Copy */}
              <div className="flex w-full items-center gap-2 rounded-xl border border-ash-200 bg-ash-50 px-3 py-2.5 dark:border-ash-700 dark:bg-ash-800">
                <span className="flex-1 truncate font-mono text-sm text-ash-700 dark:text-ash-300">
                  {shortenAddress(address, 8)}
                </span>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                    copied
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-ash-200 text-ash-600 hover:bg-ash-300 dark:bg-ash-700 dark:text-ash-300 dark:hover:bg-ash-600"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      {t("copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {t("copy")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
