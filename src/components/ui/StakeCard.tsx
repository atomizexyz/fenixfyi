"use client";

import { NextPage } from "next";
import { StakeRowDatum, StakeStatus } from "@/models/stake";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clamp } from "@/utilities/helpers";

export const StakeCard: NextPage<StakeRowDatum> = ({
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
          <dt className="text-sm font-medium primary-text">Payout</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{payout}</dd>
        </div>
        <div className="py-2 flex justify-between">
          <dt className="text-sm font-medium primary-text">Penalty</dt>
          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{penalty}</dd>
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
        <div className="py-2 flex space-x-8">
          {status !== StakeStatus.END && (
            <Link href={`/dashboard/${index}`} className="flex w-full justify-center primary-button">
              End
            </Link>
          )}
          {progress > 100.0 && status === StakeStatus.ACTIVE && (
            <Link href={`/dashboard/${index}`} className="flex w-full justify-center primary-button">
              Defer
            </Link>
          )}
        </div>
      </dl>
    </div>
  );
};
