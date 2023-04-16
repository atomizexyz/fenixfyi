"use client";

import Link from "next/link";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { calculateProgress, calculatePenalty } from "@/utilities/helpers";
import { Address, Chain, useAccount, useContractReads, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { fenixContract } from "@/libraries/fenixContract";
import { StakeStatus } from "@/models/stake";
import { CountUpDatum, DateDatum, TextDatum } from "./datum";
import CountUp from "react-countup";

export const StakeCard: NextPage<{
  stakeIndex: number;
  stakeStatus: StakeStatus;
}> = ({ stakeIndex, stakeStatus }) => {
  const [startMs, setStartMs] = useState<Date>(new Date());
  const [endMs, setEndMs] = useState<Date>(new Date());
  const [principal, setPrincipal] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [payout, setPayout] = useState<number>(0);
  const [projectedPayout, setProjectedPayout] = useState<number>(0);
  const [penalty, setPenalty] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
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
      setStartMs(new Date(stake.startTs * 1000));
      setEndMs(new Date(stake.endTs * 1000));
      setPrincipal(Number(ethers.utils.formatUnits(stake.fenix)));
      setShares(Number(ethers.utils.formatUnits(stake.shares)));

      const penalty = calculatePenalty(stake.startTs, stake.endTs, stake.term);
      setPenalty(penalty * 100);

      if (equityPoolTotalShares > 0) {
        const shares = Number(ethers.utils.formatUnits(stake.shares));
        const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;
        const payout = equityPayout * (1 - penalty);
        setProjectedPayout(payout);
      }

      const clampedProgress = calculateProgress(stake.startTs, stake.endTs);
      setClampedProgress(clampedProgress);
      setProgress(clampedProgress * 100);
      setStatus(stake.status);
      setPayout(Number(ethers.utils.formatUnits(stake.payout)));
    }
  }, [data]);

  if (data?.[0] && data?.[0].status != stakeStatus && stakeStatus != StakeStatus.ALL) return null;

  const renderPenalty = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <TextDatum title="Penalty" value="-" />;
      default:
        return <CountUpDatum title="Penalty" value={penalty} decimals={2} suffix=" %" />;
    }
  };

  const renderPayout = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <CountUpDatum title="Payout" value={payout} decimals={2} suffix=" FENIX" />;
      default:
        return <CountUpDatum title="Payout" value={projectedPayout} decimals={2} suffix=" FENIX" />;
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
                <CountUp end={progress} decimals={2} suffix=" %" />
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
        <CountUpDatum title="Principal" value={principal} decimals={2} suffix=" FENIX" />
        <CountUpDatum title="Shares" value={shares} decimals={2} />
        {renderPenalty(status)}
        {renderPayout(status)}

        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Progress</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{renderProgress(status)}</dd>
        </div>
        <div className="py-2 flex justify-between">
          {(status !== StakeStatus.END || stakeStatus == StakeStatus.ALL) && (
            <Link href={`/stake/end?stakeIndex=${stakeIndex}`} className="primary-link">
              End
            </Link>
          )}
          {((clampedProgress == 1 && status === StakeStatus.ACTIVE) || stakeStatus == StakeStatus.ALL) && (
            <Link href={`/stake/defer?address=${address}&stakeIndex=${stakeIndex}`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </dl>
    </div>
  );
};
