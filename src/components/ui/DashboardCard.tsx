"use client";

import { truncateAddress } from "@/utilities/helpers";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import { Chain, useContractReads, useToken } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";
import CountUp from "react-countup";
import { BigNumber, ethers } from "ethers";
import { Token } from "@/contexts/FenixContext";

export const DashboardCard: NextPage<{ chain: Chain }> = ({ chain }) => {
  const [token, setToken] = useState<Token | null>(null);
  const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
  const [equityPoolSupply, setEquityPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [rewardPoolSupply, setRewardPoolSupply] = useState<BigNumber>(BigNumber.from(0));

  const { data: tokenData } = useToken({
    address: fenixContract(chain).address,
    chainId: chain?.id,
  });

  useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "shareRate",
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "rewardPoolSupply",
      },
    ],
    onSuccess(data) {
      setShareRate(BigNumber.from(data?.[0] ?? 0));
      setEquityPoolSupply(BigNumber.from(data?.[1] ?? 0));
      setRewardPoolSupply(BigNumber.from(data?.[2] ?? 0));
    },
    watch: true,
  });

  useEffect(() => {
    if (tokenData) {
      setToken(tokenData);
    }
  }, [tokenData]);

  return (
    <dl className="divide-y secondary-divider">
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Chain</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">
          <Link href={`/dashboard/${chain.id}`} className="primary-link">
            {chain.name}
          </Link>
        </dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Status</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">
          <div className="flex items-center justify-end gap-x-2 sm:justify-start">
            {token ? (
              <>
                <div className="status-success flex-none rounded-full p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="primary-text">Active</div>
              </>
            ) : (
              <>
                <div className="status-error flex-none rounded-full p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="primary-text">Inactive</div>
              </>
            )}
          </div>
        </dd>
      </div>

      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Equity Supply</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
          <CountUp
            end={Number(ethers.utils.formatUnits(equityPoolSupply))}
            preserveValue={true}
            separator=","
            decimals={2}
          />
        </dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Reward Supply</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
          <CountUp
            end={Number(ethers.utils.formatUnits(rewardPoolSupply))}
            preserveValue={true}
            separator=","
            decimals={2}
          />
        </dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Share Rate</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
          <CountUp end={Number(ethers.utils.formatUnits(shareRate))} preserveValue={true} separator="," decimals={2} />
        </dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Address</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
          {truncateAddress(token?.address ?? "")}
        </dd>
      </div>
      <div className="py-2 flex space-x-8">
        <a href="#" className="tertiary-link">
          <IconCopy className="w-5 h-5" />
        </a>
        <a href="#" className="tertiary-link">
          <IconShare2 className="w-5 h-5" />
        </a>
      </div>
    </dl>
  );
};
