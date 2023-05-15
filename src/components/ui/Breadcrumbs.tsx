"use client";

import { fenixContract } from "@/libraries/fenixContract";
import { IconChevronRight, IconEyeFilled, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Chain, Address, useBalance, useAccount, useNetwork, useToken } from "wagmi";
import { InjectedConnector } from "wagmi/dist/connectors/injected";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const path = pathname?.split("/").filter((item) => item !== "");
  const [token, setToken] = useState<any>(null);
  const [fenixBalance, setFenixBalance] = useState<any>(null);

  const { address, connector } = useAccount() as unknown as { address: Address; connector: InjectedConnector };
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: fenixData } = useBalance({
    address: address,
    token: fenixContract(chain).address,
    staleTime: 20_000,
  });

  const { data: tokenData } = useToken({
    address: fenixContract(chain).address,
    chainId: chain?.id,
  });

  useEffect(() => {
    setToken(tokenData);
    setFenixBalance(fenixData);
  }, [fenixData, tokenData]);

  return (
    <div className="flex items-center mx-auto max-w-7xl overflow-hidden py-4 px-6 lg:px-8 justify-between">
      <nav aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <Link href="/" className="secondary-link">
                <IconHome className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
          {path?.map((name, index) => {
            const href = `/${path.slice(0, index + 1).join("/")}`;

            return (
              <li key={index}>
                <div className="flex items-center">
                  <IconChevronRight className="h-4 w-4 flex-shrink-0 primary-element" aria-hidden="true" />
                  <Link href={href} className="ml-4 text-sm secondary-link capitalize">
                    {name}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
      {token && (
        <button
          className="flex items-center rounded-full px-3 py-1 text-sm leading-6 primary-link ring-1 ring-inset glass"
          onClick={() => {
            (connector as InjectedConnector)?.watchAsset?.({
              address: token.address,
              decimals: token.decimals,
              image: "https://ipfs.io/ipfs/QmVcNfm2AvoZwcH5iKD5sQy8hBLjWvtpnG8R8gc7jhBje4",
              symbol: token.symbol,
            });
          }}
        >
          <div className="font-mono">
            <CountUp start={0} end={Number(fenixBalance?.formatted ?? 0)} preserveValue={true} decimals={2} />
          </div>

          <div className="pl-2">{token.symbol}</div>
          <IconEyeFilled className="h-4 w-4 flex-shrink-0 ml-2 primary-text" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
