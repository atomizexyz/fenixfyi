"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { FENIX_CHAINS } from "@/config/chains";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ChainSelector() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentChain = FENIX_CHAINS.find((c) => c.chain.id === chain?.id);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!chain) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-ash-200 px-2.5 py-1.5 text-sm font-medium text-ash-700 transition-colors hover:bg-ash-100 dark:border-ash-700 dark:text-ash-300 dark:hover:bg-ash-800"
      >
        <span className="h-4 w-4 rounded-full bg-gradient-to-br from-fenix-400 to-fenix-600" />
        <span className="hidden sm:inline">
          {currentChain?.chain.name || "Unknown"}
        </span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-56 rounded-xl border border-ash-200 bg-white p-1 shadow-lg dark:border-ash-700 dark:bg-ash-900">
          {FENIX_CHAINS.filter((c) => c.enabled).map((config) => (
            <button
              key={config.chain.id}
              onClick={() => {
                switchChain({ chainId: config.chain.id });
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                config.chain.id === chain?.id
                  ? "bg-fenix-500/10 text-fenix-600 dark:text-fenix-400"
                  : "text-ash-700 hover:bg-ash-100 dark:text-ash-300 dark:hover:bg-ash-800"
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-ash-200 to-ash-300 text-xs font-bold dark:from-ash-700 dark:to-ash-600">
                {config.chain.name.charAt(0)}
              </span>
              <span>{config.chain.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
