"use client";

import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateProgress, calculatePenalty } from "@/utilities/helpers";
import { Address, Chain, useAccount, useContractReads, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { fenixContract } from "@/libraries/fenixContract";
import { StakeStatus } from "@/models/stake";
import { StatusState } from "connectkit/build/siwe/SIWEContext";

export const StakeRow: NextPage<{
  stakeIndex: number;
  stakeStatus: StakeStatus;
}> = ({ stakeIndex, stakeStatus }) => {
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

  const { data } = useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "stakeFor",
        args: [address, BigNumber.from(stakeIndex)],
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolTotalShares",
      },
    ],
    watch: true,
  });

  useEffect(() => {
    const stake = data?.[0];
    const equityPoolSupply = Number(ethers.utils.formatUnits(data?.[1] ?? 0));
    const equityPoolTotalShares = Number(ethers.utils.formatUnits(data?.[2] ?? 0));
    if (stake && equityPoolTotalShares && equityPoolSupply) {
      setStartString(new Date(stake.startTs * 1000).toLocaleDateString());
      setEndString(new Date(stake.endTs * 1000).toLocaleDateString());
      setPrincipal(Number(ethers.utils.formatUnits(stake.fenix)).toFixed(2));
      setShares(Number(ethers.utils.formatUnits(stake.shares)).toFixed(2));

      const penalty = calculatePenalty(stake.startTs, stake.endTs, stake.term);
      setPenalty((penalty * 100).toFixed(2) + "%");

      if (equityPoolTotalShares > 0) {
        const shares = Number(ethers.utils.formatUnits(stake.shares));
        const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;
        const payout = equityPayout * (1 - penalty);
        setPayout(payout.toFixed(2));
      }

      const clampedProgress = calculateProgress(stake.startTs, stake.endTs);
      setClampedProgress(clampedProgress);
      setProgress((clampedProgress * 100).toFixed(2) + "%");
      setStatus(stake.status);
    }
  }, [data]);

  if (data?.[0].status != stakeStatus) return null;

  const renderPenalty = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <div>-</div>;
      default:
        return <div>{penalty}</div>;
    }
  };

  const renderProgress = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
        return <div className="text-center uppercase">Ended</div>;
      case StakeStatus.DEFER:
        return <div className="text-center uppercase">Deferred</div>;
      default:
        return (
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
        );
    }
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6">{startString}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text">{endString}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{principal}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{shares}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{renderPenalty(status)}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text numerical-data">{payout}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">{renderProgress(status)}</td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-4">
          {status !== StakeStatus.END && (
            <Link href={`/stake/end?stakeIndex=${stakeIndex}`} className="primary-link">
              End
            </Link>
          )}
          {clampedProgress == 1 && status === StakeStatus.ACTIVE && (
            <Link href={`/stake/defer?address=${address}&stakeIndex=${stakeIndex}`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
};
