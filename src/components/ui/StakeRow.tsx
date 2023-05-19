"use client";

import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateEarlyPayout, calculateLatePayout, calculateProgress } from "@/utilities/helpers";
import { Address, useAccount } from "wagmi";
import { ethers } from "ethers";
import { StakeStatus } from "@/models/stakeStatus";
import CountUp from "react-countup";

export const StakeRow: NextPage<{
  stakeIndex: number;
  stake: any;
  equityPoolSupply: number;
  equityPoolTotalShares: number;
  rewardPoolSupply: number;
  cooldownUnlockTs: number;
}> = ({ stakeIndex, stake, equityPoolSupply, equityPoolTotalShares, rewardPoolSupply = 0, cooldownUnlockTs }) => {
  const [term, setTerm] = useState("-");
  const [startString, setStartString] = useState("-");
  const [endString, setEndString] = useState("-");
  const [principal, setPrincipal] = useState("-");
  const [shares, setShares] = useState("-");
  const [payout, setPayout] = useState("-");
  const [futurePayout, setFuturePayout] = useState("-");
  const [projectedPayout, setProjectedPayout] = useState("-");
  const [penalty, setPenalty] = useState(0);
  const [progress, setProgress] = useState<string>("0%");
  const [clampedProgress, setClampedProgress] = useState(0);
  const [status, setStatus] = useState(0);

  const { address } = useAccount() as unknown as { address: Address };

  useEffect(() => {
    const currentTs = Math.floor(Date.now() / 1000);

    const earlyPayout = calculateEarlyPayout(stake, currentTs);
    if (earlyPayout) {
      const penalty = 1 - earlyPayout;
      setPenalty(penalty);
    }

    const latePayout = calculateLatePayout(stake, currentTs);
    if (latePayout) {
      const penalty = 1 - latePayout;
      setPenalty(penalty);
    }

    if (stake && equityPoolTotalShares && equityPoolSupply) {
      setTerm(stake.term);
      setStartString(new Date(stake.startTs * 1000).toLocaleDateString());
      setEndString(new Date(stake.endTs * 1000).toLocaleDateString());
      const principalNumber = Number(ethers.utils.formatUnits(stake.fenix));
      setPrincipal(
        principalNumber.toLocaleString(undefined, {
          minimumFractionDigits: principalNumber > 1000 ? 0 : 2,
          maximumFractionDigits: principalNumber > 1000 ? 0 : 2,
        })
      );
      const sharesNumber = Number(ethers.utils.formatUnits(stake.shares));
      setShares(
        sharesNumber.toLocaleString(undefined, {
          minimumFractionDigits: sharesNumber > 1000 ? 0 : 2,
          maximumFractionDigits: sharesNumber > 1000 ? 0 : 2,
        })
      );

      if (equityPoolTotalShares > 0) {
        const shares = Number(ethers.utils.formatUnits(stake.shares));
        const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;
        const payout = equityPayout * (1 - penalty);
        setProjectedPayout(payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        let poolPayout = 0;
        if (stake.endTs > cooldownUnlockTs) {
          poolPayout = (shares / equityPoolTotalShares) * rewardPoolSupply;
        }
        const futurePayoutNumber = equityPayout + poolPayout;
        setFuturePayout(
          futurePayoutNumber.toLocaleString(undefined, {
            minimumFractionDigits: futurePayoutNumber > 1000 ? 0 : 2,
            maximumFractionDigits: futurePayoutNumber > 1000 ? 0 : 2,
          })
        );
      }

      const progressPct = calculateProgress(stake.startTs, stake.endTs);
      setClampedProgress(progressPct * 100);
      setProgress(clampedProgress.toFixed(2) + "%");
      setStatus(stake.status);
      setPayout(Number(ethers.utils.formatUnits(stake.payout)).toFixed(2));
    }
  }, [clampedProgress, cooldownUnlockTs, equityPoolSupply, equityPoolTotalShares, penalty, rewardPoolSupply, stake]);

  const renderPenalty = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <div>-</div>;
      default:
        return (
          <div>
            <CountUp end={penalty * 100} decimals={2} suffix="%" />
          </div>
        );
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
              <span className="text-sm primary-text font-mono my-2">
                <CountUp end={clampedProgress} decimals={2} suffix="%" />
              </span>
            </div>
          </div>
        );
    }
  };

  const renderPayout = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <>{payout}</>;
      default:
        return <>{projectedPayout}</>;
    }
  };

  const renderFuturePayout = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <>{payout}</>;
      default:
        return <>{futurePayout}</>;
    }
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 text-sm secondary-text">{startString}</td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text">{endString}</td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text numerical-data">{term}</td>

      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text numerical-data">{principal}</td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text numerical-data">{shares}</td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text numerical-data">{renderPenalty(status)}</td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text numerical-data">{renderPayout(status)}</td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text numerical-data">
        {renderFuturePayout(status)}
      </td>
      <td className="whitespace-nowrap px-2 py-4 text-sm secondary-text font-mono">{renderProgress(status)}</td>
      <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-2">
          {status !== StakeStatus.END && (
            <Link href={`/stake/end?stakeIndex=${stakeIndex}`} className="primary-link">
              End
            </Link>
          )}
          {clampedProgress == 100 && status === StakeStatus.ACTIVE && (
            <Link href={`/stake/defer?address=${address}&stakeIndex=${stakeIndex}`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
};
