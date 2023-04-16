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
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";

export const DashboardCard: NextPage<{ chain: Chain }> = ({ chain }) => {
  const [token, setToken] = useState<Token | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
  const [equityPoolSupply, setEquityPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [rewardPoolSupply, setRewardPoolSupply] = useState<BigNumber>(BigNumber.from(0));

  const [_, setCopy] = useCopyToClipboard();
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
      if (tokenData.address) {
        setTokenAddress(tokenData.address);
      }
    }
  }, [tokenData]);

  const copyAddress = () => {
    if (token?.address) {
      setCopy(token.address);
      toast.success(`${truncateAddress(token.address)} copied to clipboard`);
    } else {
      toast.error("Could not copy address");
    }
  };

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
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full status-success-background" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 status-success" />
                </span>
                <div className="primary-text">Active</div>
              </>
            ) : (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full status-error-background" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 status-error" />
                </span>
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
            suffix=" FENIX"
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
            suffix=" FENIX"
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
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{truncateAddress(tokenAddress)}</dd>
      </div>
      <div className="py-2 flex space-x-8">
        <button className="tertiary-link" onClick={() => copyAddress()}>
          <IconCopy className="w-5 h-5" />
        </button>
        <Link href={`${chain.blockExplorers?.default.url}/address/${tokenAddress}`} className="tertiary-link">
          <IconShare2 className="w-5 h-5" />
        </Link>
      </div>
    </dl>
  );
};
