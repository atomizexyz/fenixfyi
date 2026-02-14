import { useState, useEffect } from "react";
import { SECONDS_PER_DAY } from "@/config/constants";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ready: boolean;
}

export function useCountdown(targetSeconds: number): CountdownParts {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = Math.max(targetSeconds - now, 0);

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ready: true };
  }

  return {
    days: Math.floor(remaining / SECONDS_PER_DAY),
    hours: Math.floor((remaining % SECONDS_PER_DAY) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    ready: false,
  };
}
