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

export const DashboardRow: NextPage<{ chain: Chain }> = ({ chain }) => {
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
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
        <Link href={`/dashboard/${chain.id}`} className="primary-link">
          {chain.name}
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6">
        {token ? (
          <span className="inline-flex rounded-full  px-2 text-xs font-semibold leading-5 badge-success">Active</span>
        ) : (
          <span className="inline-flex rounded-full  px-2 text-xs font-semibold leading-5 badge-error">Inactive</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text text-right font-mono">
        <CountUp
          end={Number(ethers.utils.formatUnits(equityPoolSupply))}
          preserveValue={true}
          separator=","
          decimals={2}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text text-right font-mono">
        <CountUp
          end={Number(ethers.utils.formatUnits(rewardPoolSupply))}
          preserveValue={true}
          separator=","
          decimals={2}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text text-right font-mono">
        <CountUp end={Number(ethers.utils.formatUnits(shareRate))} preserveValue={true} separator="," decimals={2} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">
        {truncateAddress(token?.address ?? "")}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-4">
          <a href="#" className="tertiary-link">
            <IconCopy className="w-5 h-5" />
          </a>

          <a href="#" className="tertiary-link">
            <IconShare2 className="w-5 h-5" />
          </a>
        </div>
      </td>
    </tr>
  );
};
