"use client";

import { IconInfoCircleFilled } from "@tabler/icons-react";
import type { NextPage } from "next";
import CountUp from "react-countup";

interface BonusCalculatorStat {
  sizeBonus: number;
  timeBonus: number;
  base: number;
  subtotal: number;
  shareRate: number;
  shares: number;
}

export const BonusCalculator: NextPage<BonusCalculatorStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">Calculator</div>

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
                  <div className="font-medium ">Size Bonus</div>
                  <div className="tooltip tooltip-right" data-tip="Size Bonus Formula">
                    <IconInfoCircleFilled className="w-4 h-4" />
                  </div>
                </div>
              </td>
              <td className="text-right text-sm secondary-text">
                <pre>
                  <CountUp end={props.sizeBonus} preserveValue={true} separator="," decimals={6} />
                </pre>
              </td>
            </tr>
            <tr>
              <td>
                <div className="flex flex-row space-x-1 items-center primary-text">
                  <div className="font-medium">Time Bonus</div>
                  <div className="tooltip tooltip-right" data-tip="Time Bonus Formula">
                    <IconInfoCircleFilled className="w-4 h-4" />
                  </div>
                </div>
              </td>
              <td className="text-right text-sm secondary-text">
                <pre>
                  <CountUp end={props.timeBonus} preserveValue={true} separator="," decimals={6} />
                </pre>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="text-left md:text-right text-sm primary-text sm:table-cell">
                Subtotal
              </th>
              <td className="text-right text-sm secondary-text">
                <pre>
                  <CountUp end={props.subtotal} preserveValue={true} separator="," decimals={6} />
                </pre>
              </td>
            </tr>

            <tr>
              <th scope="row" className="text-left md:text-right text-sm primary-text sm:table-cell">
                Share Rate
              </th>
              <td className="text-right text-sm secondary-text">
                <pre>
                  <CountUp end={props.shareRate} preserveValue={true} separator="," suffix="%" decimals={5} />
                </pre>
              </td>
            </tr>
            <tr>
              <th scope="row" className="text-left md:text-right text-sm primary-text sm:table-cell">
                Shares
              </th>
              <td className="text-right text-sm secondary-text">
                <pre>
                  <CountUp end={props.shares} preserveValue={true} separator="," decimals={6} />
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
