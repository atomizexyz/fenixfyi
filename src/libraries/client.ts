import { createClient, configureChains, Chain } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { polygonMumbai, goerli, polygon } from "wagmi/chains";

import { pulseChain, x1Devnet } from "./chains";
import { foundry } from "wagmi/chains";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const quickNodeId = process.env.NEXT_PUBLIC_QUICK_NODE_ID as string;
const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

export let allChains: Chain[];

switch (chainNetwork) {
  case "mainnet":
    allChains = [polygon];
    break;
  case "testnet":
    allChains = [goerli, polygonMumbai, pulseChain, x1Devnet];
    break;
  default:
    allChains = [foundry];
    break;
}

const { chains, provider, webSocketProvider } = configureChains(
  allChains,
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === polygon.id) {
          return {
            http: `https://still-autumn-feather.matic.discover.quiknode.pro/${quickNodeId}/`,
            webSocket: `wss://still-autumn-feather.matic.discover.quiknode.pro/${quickNodeId}/`,
          };
        } else if (chain.id === goerli.id) {
          return {
            http: `https://rpc.ankr.com/eth_goerli`,
          };
        } else if (chain.id === polygonMumbai.id) {
          return {
            http: `https://rpc.ankr.com/polygon`,
          };
        } else {
          return null;
        }
      },
      priority: 0,
    }),
    alchemyProvider({ apiKey: alchemyId, priority: 1 }),
    infuraProvider({ apiKey: infuraId, priority: 1 }),
    publicProvider({ priority: 1 }),
  ],
  { pollingInterval: 10_000, stallTimeout: 5_000 }
);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "fenix.fyi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "df88ad6ea5836921bbc94cdf84eaf47c",
        metadata: {
          name: "FENIX",
          description: "Empower your crypto, earn while you hold Fenix",
          url: "https://fenix.fyi",
          icons: ["https://fenix.fyi/images/icons/icon.png"],
        },
        showQrModal: false,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
      },
    }),
  ],
  provider,
  webSocketProvider,
});
