import { BigNumber, ethers } from "ethers";

export const UTC_TIME = new Date().getTime() / 1000;

export const truncateAddress = (address: string) => {
  if (address == undefined) return "";
  return `${address.slice(0, 6)}•••${address.slice(-4)}`;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const daysSince = (date: number) => {
  return Math.floor((UTC_TIME - date) / 86400);
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
