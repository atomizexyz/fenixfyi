import { http, webSocket, fallback } from "viem";
import type { Transport } from "viem";

interface ChainRpcConfig {
  http: string[];
  wss: string[];
}

export const CHAIN_RPC_ENDPOINTS: Record<number, ChainRpcConfig> = {
  // Ethereum
  1: {
    http: [
      "https://eth.llamarpc.com",
      "https://ethereum-rpc.publicnode.com",
      "https://1rpc.io/eth",
      "https://rpc.mevblocker.io",
      "https://eth.drpc.org",
    ],
    wss: ["wss://ethereum-rpc.publicnode.com"],
  },
  // Polygon
  137: {
    http: [
      "https://polygon-rpc.com",
      "https://polygon-bor-rpc.publicnode.com",
      "https://1rpc.io/matic",
      "https://polygon.drpc.org",
    ],
    wss: ["wss://polygon-bor-rpc.publicnode.com"],
  },
  // BSC
  56: {
    http: [
      "https://bsc-dataseed.bnbchain.org",
      "https://bsc-dataseed1.bnbchain.org",
      "https://bsc-rpc.publicnode.com",
      "https://1rpc.io/bnb",
      "https://bsc.drpc.org",
    ],
    wss: ["wss://bsc-rpc.publicnode.com"],
  },
  // Avalanche
  43114: {
    http: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche-c-chain-rpc.publicnode.com",
      "https://1rpc.io/avax/c",
      "https://avax.meowrpc.com",
    ],
    wss: ["wss://avalanche-c-chain-rpc.publicnode.com"],
  },
  // Moonbeam
  1284: {
    http: [
      "https://rpc.api.moonbeam.network",
      "https://moonbeam-rpc.publicnode.com",
      "https://1rpc.io/glmr",
      "https://moonbeam.drpc.org",
    ],
    wss: ["wss://wss.api.moonbeam.network"],
  },
  // Evmos
  9001: {
    http: [
      "https://evmos.lava.build",
      "https://evmos-evm-rpc.publicnode.com",
      "https://evmos.drpc.org",
    ],
    wss: ["wss://evmos-evm-rpc.publicnode.com"],
  },
  // Fantom
  250: {
    http: [
      "https://rpcapi.fantom.network",
      "https://rpc.ftm.tools",
      "https://fantom-rpc.publicnode.com",
      "https://1rpc.io/ftm",
    ],
    wss: ["wss://fantom-rpc.publicnode.com"],
  },
  // Dogechain
  2000: {
    http: [
      "https://rpc.dogechain.dog",
      "https://rpc-us.dogechain.dog",
      "https://rpc-sg.dogechain.dog",
      "https://rpc.ankr.com/dogechain",
    ],
    wss: [],
  },
  // OKC
  66: {
    http: [
      "https://exchainrpc.okex.org",
      "https://oktc-mainnet.public.blastapi.io",
      "https://1rpc.io/oktc",
    ],
    wss: [],
  },
  // EthereumPoW
  10001: {
    http: ["https://mainnet.ethereumpow.org"],
    wss: [],
  },
  // Base
  8453: {
    http: [
      "https://mainnet.base.org",
      "https://base.llamarpc.com",
      "https://1rpc.io/base",
      "https://base-rpc.publicnode.com",
      "https://base.drpc.org",
    ],
    wss: ["wss://base-rpc.publicnode.com"],
  },
  // PulseChain
  369: {
    http: [
      "https://rpc.pulsechain.com",
      "https://pulsechain-rpc.publicnode.com",
      "https://rpc-pulsechain.g4mm4.io",
    ],
    wss: ["wss://pulsechain-rpc.publicnode.com"],
  },
};

export function createChainTransport(chainId: number): Transport {
  const config = CHAIN_RPC_ENDPOINTS[chainId];
  if (!config) {
    throw new Error(`No RPC config for chain ${chainId}`);
  }

  const transports = [
    ...config.http.map((url) => http(url)),
    ...config.wss.map((url) => webSocket(url)),
  ];

  return fallback(transports);
}

export const chainTransports: Record<number, Transport> = Object.fromEntries(
  Object.keys(CHAIN_RPC_ENDPOINTS).map((id) => {
    const chainId = Number(id);
    return [chainId, createChainTransport(chainId)];
  })
);
