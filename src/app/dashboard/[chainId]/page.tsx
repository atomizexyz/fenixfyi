"use client";

import { CardContainer, Container } from "@/components/containers";
import { ChainDropdown } from "@/components/ui";
import { useEffect, useState } from "react";

interface ChainStatus {
  chainName: string;
  chainId: number;
  daysSinceLaunch: number;
  tokenSymbol: string;
  tokenAddress: string;
  equityPool: number;
  rewardPool: number;
  shareRate: number;
}

const DashboardChainId = () => {
  const [chainStatus, setChainStatus] = useState<ChainStatus | null>(null);

  useEffect(() => {
    const chainName = "Ethereum";
    const chainId = 1;
    const daysSinceLaunch = 1;
    const tokenSymbol = "FENIX";
    const tokenAddress = "0xCdD5536bCCf4c34a3b5E6B111f9da41B28ae50F1";
    const equityPool = 0;
    const rewardPool = 0;
    const shareRate = 0;

    setChainStatus({
      chainName,
      chainId,
      daysSinceLaunch,
      tokenSymbol,
      tokenAddress,
      equityPool,
      rewardPool,
      shareRate,
    });
  }, []);

  return (
    <Container>
      <CardContainer>
        <div className="py-5 flex justify-between">
          <div>
            <h3 className="text-base font-semibold primary-text">{chainStatus?.chainName}</h3>
            <p className="mt-1 text-sm secondary-text">FENIX on stats on {chainStatus?.chainName} </p>
          </div>
          <div>
            <ChainDropdown />
          </div>
        </div>

        <div className="border-t primary-divider">
          <dl className="divide-y secondary-divider">
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Chain Id</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">{chainStatus?.chainId}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Days Since Launch</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">
                {chainStatus?.daysSinceLaunch}
              </dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Contract Symbol</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0">{chainStatus?.tokenSymbol}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Contract Address</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">
                {chainStatus?.tokenAddress}
              </dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Equity Pool</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">{chainStatus?.equityPool}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Reward Pool</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">{chainStatus?.rewardPool}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Share Rate</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">{chainStatus?.shareRate}</dd>
            </div>
          </dl>
        </div>
      </CardContainer>
    </Container>
  );
};

export default DashboardChainId;
