import {
  mainnet,
  polygon,
  avalanche,
  bsc,
  base,
  fantom,
  moonbeam,
  evmos,
  pulsechain,
  dogechain,
  okc,
} from "wagmi/chains";
import { defineChain } from "viem";
import type { Chain } from "wagmi/chains";

// EthereumPoW is not in viem/chains, define it manually
export const ethereumPow = defineChain({
  id: 10_001,
  name: "EthereumPoW",
  nativeCurrency: { name: "ETHW", symbol: "ETHW", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.ethereumpow.org"] },
  },
  blockExplorers: {
    default: { name: "ETHW Explorer", url: "https://www.oklink.com/ethw" },
  },
});

export interface FenixChainConfig {
  chain: Chain;
  xenContract: `0x${string}`;
  fenixContract: `0x${string}`;
  iconSlug: string;
  enabled: boolean;
}

// FENIX contract addresses per chain
const FENIX_CONTRACT =
  "0xC3e8abfA04B0EC442c2A4D65699a40F7FcEd8055" as `0x${string}`;
const FENIX_CONTRACT_EVMOS =
  "0x7c27d2D2044FE90Cb98f5ECdc235839FdE740124" as `0x${string}`;
const FENIX_CONTRACT_BASE =
  "0x07FdE3eD7727c1D84171A6e5815964d50827CF69" as `0x${string}`;

// FENIX chain configurations for all 12 supported chains
export const FENIX_CHAINS: FenixChainConfig[] = [
  {
    chain: mainnet,
    xenContract:
      "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "ethereum",
    enabled: true,
  },
  {
    chain: polygon,
    xenContract:
      "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "polygon",
    enabled: true,
  },
  {
    chain: bsc,
    xenContract:
      "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "bsc",
    enabled: true,
  },
  {
    chain: avalanche,
    xenContract:
      "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "avalanche",
    enabled: true,
  },
  {
    chain: moonbeam,
    xenContract:
      "0xb564A5767A00Ee9075cAC561c427643286F8F4E1" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "moonbeam",
    enabled: true,
  },
  {
    chain: evmos,
    xenContract:
      "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e" as `0x${string}`,
    fenixContract: FENIX_CONTRACT_EVMOS,
    iconSlug: "evmos",
    enabled: true,
  },
  {
    chain: fantom,
    xenContract:
      "0xeF4B763385838FfFc708000f884026B8c0434275" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "fantom",
    enabled: true,
  },
  {
    chain: dogechain,
    xenContract:
      "0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "dogechain",
    enabled: true,
  },
  {
    chain: okc,
    xenContract:
      "0x1cC4D981e897A3D2E7785093A648c0a75fAd0453" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "okc",
    enabled: true,
  },
  {
    chain: ethereumPow,
    xenContract:
      "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "ethw",
    enabled: true,
  },
  {
    chain: base,
    xenContract:
      "0xffcbF84650cE02DaFE96926B37a0ac5E34932fa5" as `0x${string}`,
    fenixContract: FENIX_CONTRACT_BASE,
    iconSlug: "base",
    enabled: true,
  },
  {
    chain: pulsechain,
    xenContract:
      "0x8a7FDcA264e87b6da72D000f22186B4403081A2a" as `0x${string}`,
    fenixContract: FENIX_CONTRACT,
    iconSlug: "pulsechain",
    enabled: true,
  },
];

export const SUPPORTED_CHAINS = FENIX_CHAINS.filter((c) => c.enabled).map(
  (c) => c.chain
);

export function getChainConfig(
  chainId: number
): FenixChainConfig | undefined {
  return FENIX_CHAINS.find((c) => c.chain.id === chainId);
}
