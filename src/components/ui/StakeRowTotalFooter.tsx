"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { StakeStatus } from "@/models/stakeStatus";
import { calculateEarlyPayout, calculateLatePayout } from "@/utilities/helpers";

export const StakeRowTotalFooter: NextPage<{
  allStakes: any[];
  stakeStatus: StakeStatus;
  equityPoolTotalShares: number;
  equityPoolSupply: number;
  rewardPoolSupply: number;
  cooldownUnlockTs: number;
}> = ({ allStakes, stakeStatus, equityPoolTotalShares, equityPoolSupply, rewardPoolSupply, cooldownUnlockTs }) => {
  const [totalPrincipals, setTotalPrincipals] = useState("-");
  const [totalShares, setTotalShares] = useState("-");
  const [totalPayouts, setTotalPayouts] = useState("-");
  const [totalFuturePayouts, setTotalFuturePayouts] = useState("-");

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

    setTotalFuturePayouts(
      tmpTotalFuturePayouts.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    setTotalShares(
      tmpTotalShares.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    setTotalPrincipals(
      tmpTotalPrincipals.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    setTotalPayouts(
      tmpTotalPayouts.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }, [allStakes, cooldownUnlockTs, equityPoolSupply, equityPoolTotalShares, rewardPoolSupply, stakeStatus]);

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6">Total:</td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6"></td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6"></td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text numerical-data">{totalPrincipals}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text numerical-data">{totalShares}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text"></td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text numerical-data">{totalPayouts}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text numerical-data">{totalFuturePayouts}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text"></td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text"></td>
    </tr>
  );
};
