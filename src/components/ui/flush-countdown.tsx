"use client";

import NumberFlow from "@number-flow/react";
import { useCountdown } from "@/hooks/use-countdown";

interface FlushCountdownProps {
  target: number;
  readyLabel: string;
}

export function FlushCountdown({ target, readyLabel }: FlushCountdownProps) {
  const { days, hours, minutes, seconds, ready } = useCountdown(target);

  if (ready) {
    return (
      <span className="text-emerald-600 dark:text-emerald-400">
        {readyLabel}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-0.5 text-ash-900 dark:text-ash-100">
      {days > 0 && (
        <>
          <NumberFlow
            value={days}
            transformTiming={{ duration: 400, easing: "ease-out" }}
          />
          <span className="text-ash-400">d</span>{" "}
        </>
      )}
      <NumberFlow
        value={hours}
        format={{ minimumIntegerDigits: days > 0 ? 2 : 1 }}
        transformTiming={{ duration: 400, easing: "ease-out" }}
      />
      <span className="text-ash-400">h</span>{" "}
      <NumberFlow
        value={minutes}
        format={{ minimumIntegerDigits: 2 }}
        transformTiming={{ duration: 400, easing: "ease-out" }}
      />
      <span className="text-ash-400">m</span>{" "}
      <NumberFlow
        value={seconds}
        format={{ minimumIntegerDigits: 2 }}
        transformTiming={{ duration: 400, easing: "ease-out" }}
      />
      <span className="text-ash-400">s</span>
    </span>
  );
}
