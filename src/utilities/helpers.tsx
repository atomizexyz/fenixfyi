import { BigNumber, ethers } from "ethers";
import { UTC_TIME, ONE_DAY_TS, ONE_EIGHTY_DAYS_TS, FENIX_MAX_STAKE_LENGTH } from "./constants";
import { StakeStatus } from "@/models/stakeStatus";

export const truncateAddress = (address: string) => {
  if (address == undefined) return "";
  return `${address.slice(0, 6)}••••${address.slice(-4)}`;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const daysSince = (date: number) => {
  return Math.floor((UTC_TIME - date) / ONE_DAY_TS);
};

export const formatDecimals = (value: number, decimals: number, suffix?: string) => {
  return (
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + (suffix ? ` ${suffix}` : "")
  );
};

export const toGwei = (value: BigNumber) => {
  return ethers.utils.formatUnits(value, "gwei");
};

export const calculateProgress = (startTs: number, endTs: number) => {
  const todayTs = Math.floor(new Date().getTime() / 1000);
  const progressTs = todayTs - startTs;
  const durationTs = endTs - startTs;
  const progress = progressTs / durationTs;
  return clamp(progress, 0, 1);
};

export const calculateEarlyPayout = (stake: any, blockTs: number) => {
  if (blockTs < stake.startTs || stake.status != StakeStatus.ACTIVE) return null;
  if (blockTs > stake.endTs) return null;

  const termDelta = blockTs - stake.startTs;
  const scaleTerm = stake.term * ONE_DAY_TS;
  const ratio = termDelta / scaleTerm;
  return Math.pow(ratio, 2);
};

export const calculateLatePayout = (stake: any, blockTs: number) => {
  if (blockTs < stake.startTs || stake.status != StakeStatus.ACTIVE) return null;
  if (blockTs < stake.endTs) return null;

  const termDelta = blockTs - stake.endTs;
  if (termDelta > ONE_EIGHTY_DAYS_TS) return 0;
  const ratio = termDelta / ONE_EIGHTY_DAYS_TS;
  return 1 - Math.pow(ratio, 3);
};
