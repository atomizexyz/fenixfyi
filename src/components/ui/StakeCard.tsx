"use client";

import Link from "next/link";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { calculateProgress, calculatePenalty } from "@/utilities/helpers";
import { Address, Chain, useAccount, useContractRead, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { fenixContract } from "@/libraries/fenixContract";
import { StakeStatus } from "@/models/stake";

export const StakeCard: NextPage<{
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
                  <div className="h-6 rounded progress-gradient" style={{ width: `${clampedProgress}%` }} />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center">
                <div className="h-6 rounded glass" style={{ width: `${clampedProgress}%` }} />
              </div>
              <div className="relative flex justify-center">
                <span className="text-sm primary-text font-mono my-2">{`${progress}%`}</span>
              </div>
            </div>
          </dd>
        </div>
        <div className="py-2 flex justify-between">
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
      </dl>
    </div>
  );
};
