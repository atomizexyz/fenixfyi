"use client";

import { NextPage } from "next";
import { StakeRowDatum, StakeStatus } from "@/models/stake";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clamp } from "@/utilities/helpers";

export const StakeRow: NextPage<StakeRowDatum> = ({
  index,
  status,
  start,
  end,
  principal,
  shares,
  payout,
  penalty,
  progress,
}) => {
  const [startString, setStartString] = useState("");
  const [endString, setEndString] = useState("");
  const [clampedProgress, setClampedProgress] = useState(0);

  useEffect(() => {
    setClampedProgress(clamp(progress, 0, 100));
    setStartString(new Date(start).toLocaleDateString());
    setEndString(new Date(end).toLocaleDateString());
  }, [end, progress, start]);

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6">{startString}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm primary-text">{endString}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">{principal}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">{shares}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">{payout}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">{penalty}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">
        <div className="relative">
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
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-4">
          {status !== StakeStatus.END && (
            <Link href={`/dashboard/${index}`} className="primary-link">
              End
            </Link>
          )}
          {progress > 100.0 && status === StakeStatus.ACTIVE && (
            <Link href={`/dashboard/${index}`} className="primary-link">
              Defer
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
};
