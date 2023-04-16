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

export const DashboardRow: NextPage<{ chain: Chain }> = ({ chain }) => {
  const [token, setToken] = useState<Token | null>(null);
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
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
        <Link href={`/dashboard/${chain.id}`} className="primary-link">
          {chain.name}
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  primary-text sm:pl-6">
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
          <button className="tertiary-link" onClick={() => copyAddress()}>
            <IconCopy className="w-5 h-5" />
          </button>

          <a href="#" className="tertiary-link">
            <IconShare2 className="w-5 h-5" />
          </a>
        </div>
      </td>
    </tr>
  );
};
