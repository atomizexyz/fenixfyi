import { ethers } from "ethers";

export const FENIX_MAX_STAKE_LENGTH = 7665;
export const UTC_TIME = new Date().getTime() / 1000;
export const ONE_DAY_TS = 86400;
export const ONE_EIGHTY_DAYS_TS = 180 * ONE_DAY_TS;
export const WALLET_ADDRESS_REGEX = new RegExp(`^(0x[0-9a-fA-F]{40})(,0x[0-9a-fA-F]{40})*$`);
export const UNLIMITED_ALLOWANCE = ethers.utils.parseUnits(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935",
  0
);
