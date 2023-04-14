"use client";

import Link from "next/link";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { calculateProgress, calculatePenalty } from "@/utilities/helpers";
import { Address, Chain, useAccount, useContractReads, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { fenixContract } from "@/libraries/fenixContract";
import { StakeStatus } from "@/models/stake";

export const StakeCard: NextPage<{
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

  if (data?.[0].status != stakeStatus && stakeStatus != StakeStatus.ALL) return null;

  return (
    <div>
      <dl className="divide-y secondary-divider">
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Start</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">{startString}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">End</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">{endString}</dd>
        </div>

        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Principal</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{principal}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Shares</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{shares}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Penalty</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{penalty}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Payout</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{payout}</dd>
        </div>

        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Progress</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
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
                <span className="text-sm primary-text font-mono my-2">{progress}</span>
              </div>
            </div>
          </dd>
        </div>
        <div className="py-2 flex justify-between">
          {(status !== StakeStatus.END || stakeStatus == StakeStatus.ALL) && (
            <Link href={`/stake/end?stakeIndex=${stakeIndex}`} className="primary-link">
              End
            </Link>
          )}
          {((clampedProgress == 100.0 && status === StakeStatus.ACTIVE) || stakeStatus == StakeStatus.ALL) && (
            <Link href={`/stake/defer?address${address}=&stakeIndex=${stakeIndex}`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </dl>
    </div>
  );
};
