"use client";

import { navigation } from "@/models/navigation";
import { Chain, useNetwork, useToken } from "wagmi";
import { useEffect, useState } from "react";
import { fenixContract } from "@/libraries/fenixContract";
import { truncateAddress } from "@/utilities/helpers";
import Link from "next/link";

export default function Footer() {
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: tokenData } = useToken({
    address: fenixContract(chain).address,
    chainId: chain?.id,
    cacheTime: 30_000,
  });

  useEffect(() => {
    if (chain) {
      setTokenAddress(fenixContract(chain).address);
    }
  }, [chain]);

  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        {tokenAddress && tokenData && (
          <div className="justify-center flex pb-12 secondary-text">
            <Link
              href={`${chain.blockExplorers?.default.url}/address/${tokenAddress}`}
              className="flex items-center rounded-full px-3 py-1 text-sm leading-6 primary-link ring-1 ring-inset glass"
            >
              <div className="flex space-x-2 items-center secondary-text">
                <div className="truncate text-ellipsis">{chain.name}</div>
                <div>•</div>
                <div>{tokenData.symbol}</div>
                <div>•</div>
                <div className="primary-link font-mono">{truncateAddress(tokenAddress)}</div>
              </div>
            </Link>
          </div>
        )}

        <nav className="-mb-6 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.footer.map((item) => (
            <div key={item.name} className="pb-16 flex justify-center">
              <a href={item.href} className="text-sm leading-6 primary-link">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-16">
          {navigation.social.map((item) => (
            <a key={item.name} href={item.href} className="secondary-link">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 secondary-text">
          &copy; 2023 Submap, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
