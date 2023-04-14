"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import type { NextPage } from "next";
import CountUp from "react-countup";

interface BonusCalculatorStat {
  sizeBonus: number;
  timeBonus: number;
  subtotal: number;
  total: number;
  shareRate: number;
  shares: number;
}

export const BonusCalculator: NextPage<BonusCalculatorStat> = ({
  sizeBonus,
  timeBonus,
  subtotal,
  total,
  shareRate,
  shares,
}) => {
  return (
    <div className="stat">
      <div className="primary-text">Calculator</div>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-compact w-full">
          <thead>
            <tr>
              <th colSpan={1}></th>
              <th className="text-right secondary-text">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="flex flex-row space-x-1 items-center primary-text">
                  <div className="text-sm ">Size Bonus</div>
                </div>
              </td>
              <td className="text-right text-sm secondary-text font-mono">
                <CountUp end={sizeBonus} preserveValue={true} separator="," decimals={6} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex flex-row space-x-1 items-center primary-text">
                  <div className="text-sm">Time Bonus</div>
                </div>
              </td>
              <td className="text-right text-sm secondary-text font-mono">
                <CountUp end={timeBonus} preserveValue={true} separator="," decimals={6} />
              </td>
            </tr>

            <tr>
              <td>
                <div className="flex flex-row space-x-1 items-center primary-text">
                  <div className="text-sm">Subtotal Bonus</div>
                </div>
              </td>
              <td className="text-right text-sm secondary-text font-mono">
                <CountUp end={subtotal} preserveValue={true} separator="," decimals={6} />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="text-left md:text-right text-sm primary-text sm:table-cell">
                Total Shares
              </th>
              <td className="text-right text-sm secondary-text font-mono">
                <CountUp end={total} preserveValue={true} separator="," decimals={6} />
              </td>
            </tr>
            <tr>
              <th scope="row" className="text-left md:text-right text-sm primary-text sm:table-cell">
                Share Rate
              </th>
              <td className="text-right text-sm secondary-text font-mono">
                <CountUp end={shareRate} preserveValue={true} separator="," decimals={6} />
              </td>
            </tr>
            <tr>
              <th scope="row" className="text-left md:text-right text-sm primary-text sm:table-cell">
                Shares
              </th>
              <td className="text-right text-sm secondary-text font-mono">
                <CountUp end={shares} preserveValue={true} separator="," decimals={6} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
