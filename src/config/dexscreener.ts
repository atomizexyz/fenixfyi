import {
  mainnet,
  polygon,
  bsc,
  avalanche,
  moonbeam,
  evmos,
  fantom,
  dogechain,
  okc,
  base,
  pulsechain,
} from "wagmi/chains";
import { ethereumPow } from "./chains";

export const DEXSCREENER_API_BASE =
  "https://api.dexscreener.com/latest/dex/tokens";

// The 3 unique FENIX contract addresses across all 12 chains
export const FENIX_TOKEN_ADDRESSES = [
  "0xC3e8abfA04B0EC442c2A4D65699a40F7FcEd8055",
  "0x7c27d2D2044FE90Cb98f5ECdc235839FdE740124",
  "0x07FdE3eD7727c1D84171A6e5815964d50827CF69",
] as const;

// Maps DexScreener chain ID strings to Wagmi numeric chain IDs
export const DEXSCREENER_CHAIN_ID_MAP: Record<string, number> = {
  ethereum: mainnet.id,
  polygon: polygon.id,
  bsc: bsc.id,
  avalanche: avalanche.id,
  moonbeam: moonbeam.id,
  evmos: evmos.id,
  fantom: fantom.id,
  dogechain: dogechain.id,
  okexchain: okc.id,
  ethpow: ethereumPow.id,
  base: base.id,
  pulsechain: pulsechain.id,
};

export const DEXSCREENER_STALE_TIME = 30_000;
export const DEXSCREENER_REFETCH_INTERVAL = 30_000;
