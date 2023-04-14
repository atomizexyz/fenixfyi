"use client";

import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateProgress, calculatePenalty } from "@/utilities/helpers";
import { Address, Chain, useAccount, useContractRead, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { fenixContract } from "@/libraries/fenixContract";
import { StakeStatus } from "@/models/stake";
import { addDays, differenceInDays, isSameMonth, getYear } from "date-fns";

export const StakeRow: NextPage<{
  stakeIndex: number;
  stakeStatus: StakeStatus;
  equityPoolSupply: BigNumber;
  equityPoolTotalShares: BigNumber;
}> = ({ stakeIndex, stakeStatus, equityPoolSupply, equityPoolTotalShares }) => {
  const [startString, setStartString] = useState("-");
  const [endString, setEndString] = useState("-");
  const [principal, setPrincipal] = useState("-");
  const [shares, setShares] = useState("-");
  const [payout, setPayout] = useState("-");
  const [penalty, setPenalty] = useState("-");
  const [progress, setProgress] = useState("-");
  const [clampedProgress, setClampedProgress] = useState(0);
  const [status, setStatus] = useState(0);

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };

  const { data } = useContractRead({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "stakeFor",
    args: [address, BigNumber.from(stakeIndex)],
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setStartString(new Date(data.startTs * 1000).toLocaleDateString());
      setEndString(new Date(data.endTs * 1000).toLocaleDateString());
      setPrincipal(Number(ethers.utils.formatUnits(data.fenix)).toFixed(2));
      setShares(Number(ethers.utils.formatUnits(data.shares)).toFixed(2));

      const penalty = calculatePenalty(data.startTs, data.endTs, data.term);
      setPenalty((penalty * 100).toFixed(2) + "%");

      const equityPayout = data.shares.div(equityPoolTotalShares).mul(equityPoolSupply);
      const equityPayoutString = ethers.utils.formatUnits(equityPayout);
      const payout = Number(equityPayoutString) * (1 - penalty);
      setPayout(payout.toFixed(2));

      const clampedProgress = calculateProgress(data.startTs, data.endTs);
      setClampedProgress(clampedProgress);
      setProgress((clampedProgress * 100).toFixed(2) + "%");
      setStatus(data.status);
    }
  }, [data, equityPoolSupply, equityPoolTotalShares]);

  if (data?.status != stakeStatus) return null;

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6">{startString}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text">{endString}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{principal}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{shares}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{penalty}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{payout}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full rounded primary-background">
              <div className="h-6 rounded progress-gradient" style={{ width: progress }} />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="h-6 rounded glass" style={{ width: progress }} />
          </div>
          <div className="relative flex justify-center">
            <span className="text-sm primary-text font-mono my-2">{progress}</span>
          </div>
        </div>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-4">
          {status !== StakeStatus.END && (
            <Link href={`/stake/${address}/${stakeIndex}/end`} className="primary-link">
              End
            </Link>
          )}
          {clampedProgress == 100.0 && status === StakeStatus.ACTIVE && (
            <Link href={`/stake/${address}/${stakeIndex}/defer`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
};
