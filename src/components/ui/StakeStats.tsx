"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { StakeStatus } from "@/models/stakeStatus";
import { calculateEarlyPayout, calculateLatePayout } from "@/utilities/helpers";
import { set } from "date-fns";

interface NameStat {
  name: string;
  units: string;
  stat: string;
}

export const StakeStats: NextPage<{
  allStakes: any[];
  stakeStatus: StakeStatus;
  equityPoolTotalShares: number;
  equityPoolSupply: number;
  rewardPoolSupply: number;
  cooldownUnlockTs: number;
}> = ({ allStakes, stakeStatus, equityPoolTotalShares, equityPoolSupply, rewardPoolSupply, cooldownUnlockTs }) => {
  const [stats, setStats] = useState<NameStat[]>([]);

  useEffect(() => {
    let tmpTotalPrincipals = 0;
    let tmpTotalShares = 0;
    let tmpTotalPayouts = 0;
    let tmpTotalFuturePayouts = 0;

    allStakes.forEach((stake) => {
      if (stake.status === stakeStatus) {
        // Total Principals
        tmpTotalPrincipals += Number(ethers.utils.formatUnits(stake.fenix));
        // Total Shares
        tmpTotalShares += Number(ethers.utils.formatUnits(stake.shares));

        if (stakeStatus === StakeStatus.DEFER) {
          tmpTotalPayouts += Number(ethers.utils.formatUnits(stake.payout));
          tmpTotalFuturePayouts += Number(ethers.utils.formatUnits(stake.payout));
        } else if (stakeStatus === StakeStatus.ACTIVE) {
          // Total Payouts
          const currentTs = Math.floor(Date.now() / 1000);
          let penalty = 0;

          const earlyPayout = calculateEarlyPayout(stake, currentTs);
          if (earlyPayout) {
            const tmpPenalty = 1 - earlyPayout;
            penalty = tmpPenalty;
          }

          const latePayout = calculateLatePayout(stake, currentTs);
          if (latePayout) {
            const tmpPenalty = 1 - latePayout;
            penalty = tmpPenalty;
          }

          if (equityPoolTotalShares > 0) {
            const shares = Number(ethers.utils.formatUnits(stake.shares));
            const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;
            const payout = equityPayout * (1 - penalty);
            tmpTotalPayouts += payout;
          }

          // Total Future Payouts
          const shares = Number(ethers.utils.formatUnits(stake.shares));
          const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;

          let poolPayout = 0;
          if (stake.endTs > cooldownUnlockTs) {
            poolPayout = (shares / equityPoolTotalShares) * rewardPoolSupply;
          }

          tmpTotalFuturePayouts += equityPayout + poolPayout;
        }
      }
    });

    const stats: NameStat[] = [
      {
        name: "Total Principal",
        units: "FENIX",
        stat: tmpTotalPrincipals.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        name: "Total Shares",
        units: "",
        stat: tmpTotalShares.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        name: "Total Payout Now",
        units: "FENIX",
        stat: tmpTotalPayouts.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
      {
        name: "Total Future Payouts",
        units: "FENIX",
        stat: tmpTotalFuturePayouts.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      },
    ];
    setStats(stats);
  }, [allStakes, cooldownUnlockTs, equityPoolSupply, equityPoolTotalShares, rewardPoolSupply, stakeStatus]);

  return (
    <div>
      <dl className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg primary-card px-4 py-5 shadow sm:p-">
            <dt className="truncate text-sm font-medium primary-text flex justify-between">
              {item.name}
              <div className="inline text-xs tertiary-text"> {item.units} </div>
            </dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight secondary-text numerical-data ">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
