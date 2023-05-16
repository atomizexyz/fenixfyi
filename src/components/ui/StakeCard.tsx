"use client";

import Link from "next/link";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { calculateEarlyPayout, calculateLatePayout, calculateProgress } from "@/utilities/helpers";
import { Address, useAccount } from "wagmi";
import { ethers } from "ethers";
import { StakeStatus } from "@/models/stakeStatus";
import { CountUpDatum, DateDatum, TextDatum } from "./datum";
import CountUp from "react-countup";

export const StakeCard: NextPage<{
  stakeIndex: number;
  stake: any;
  equityPoolSupply: number;
  equityPoolTotalShares: number;
  rewardPoolSupply: number;
  cooldownUnlockTs: number;
}> = ({ stakeIndex, stake, equityPoolSupply, equityPoolTotalShares, rewardPoolSupply = 0, cooldownUnlockTs }) => {
  const [startMs, setStartMs] = useState<Date>(new Date());
  const [endMs, setEndMs] = useState<Date>(new Date());
  const [principal, setPrincipal] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [payout, setPayout] = useState<number>(0);
  const [futurePayout, setFuturePayout] = useState<number>(0);
  const [projectedPayout, setProjectedPayout] = useState<number>(0);
  const [penalty, setPenalty] = useState<number>(0);
  const [progress, setProgress] = useState<string>("0%");
  const [clampedProgress, setClampedProgress] = useState(0);
  const [status, setStatus] = useState(0);

  const { address } = useAccount() as unknown as { address: Address };

  useEffect(() => {
    setStartMs(new Date(stake.startTs * 1000));
    setEndMs(new Date(stake.endTs * 1000));
    setPrincipal(Number(ethers.utils.formatUnits(stake.fenix)));
    setShares(Number(ethers.utils.formatUnits(stake.shares)));

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

    if (equityPoolTotalShares > 0) {
      const shares = Number(ethers.utils.formatUnits(stake.shares));
      const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;
      const payout = equityPayout * (1 - penalty);
      setProjectedPayout(payout);

      let poolPayout = 0;
      if (stake.endTs > cooldownUnlockTs) {
        poolPayout = (shares / equityPoolTotalShares) * rewardPoolSupply;
      }
      setFuturePayout(equityPayout + poolPayout);
    }

    const progressPct = calculateProgress(stake.startTs, stake.endTs);
    setClampedProgress(progressPct * 100);
    setProgress(clampedProgress.toFixed(2) + "%");
    setStatus(stake.status);
    setPayout(Number(ethers.utils.formatUnits(stake.payout)));
  }, [clampedProgress, cooldownUnlockTs, equityPoolSupply, equityPoolTotalShares, penalty, rewardPoolSupply, stake]);

  const renderPenalty = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <TextDatum title="Penalty" value="-" />;
      default:
        return <CountUpDatum title="Penalty" value={penalty * 100} decimals={2} suffix=" %" />;
    }
  };

  const renderPayout = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <CountUpDatum title="Payout Now" value={payout} description="FENIX" decimals={2} />;
      default:
        return <CountUpDatum title="Payout Now" value={projectedPayout} description="FENIX" decimals={2} />;
    }
  };

  const renderFuturePayout = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <CountUpDatum title="Future Payout" value={payout} description="FENIX" decimals={2} />;
      default:
        return <CountUpDatum title="Future Payout" value={futurePayout} description="FENIX" decimals={2} />;
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
          <div className="relative w-32">
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
                <CountUp end={clampedProgress} decimals={2} suffix=" %" />
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <dl className="divide-y secondary-divider">
        <DateDatum title="Start" value={startMs} />
        <DateDatum title="End" value={endMs} />
        <CountUpDatum title="Principal" value={principal} description="FENIX" decimals={2} />
        <CountUpDatum title="Shares" value={shares} decimals={2} />
        {renderPenalty(status)}
        {renderPayout(status)}
        {renderFuturePayout(status)}
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Progress</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{renderProgress(status)}</dd>
        </div>
        <div className="py-2 flex justify-between">
          {(status === StakeStatus.ALL || status !== StakeStatus.END) && (
            <Link href={`/stake/end?stakeIndex=${stakeIndex}`} className="primary-link">
              End
            </Link>
          )}
          {((clampedProgress == 100 && status === StakeStatus.ACTIVE) || status == StakeStatus.ALL) && (
            <Link href={`/stake/defer?address=${address}&stakeIndex=${stakeIndex}`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </dl>
    </div>
  );
};
