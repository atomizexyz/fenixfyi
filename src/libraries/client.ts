import { createClient, configureChains, Chain } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { mainnet, polygonMumbai, goerli } from "wagmi/chains";

import { pulseChain, x1Devnet } from "./chains";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

let allChains: Chain[];
if (chainNetwork == "mainnet") {
  allChains = [mainnet];
} else {
  allChains = [goerli, polygonMumbai, pulseChain, x1Devnet];
}

const { chains, provider, webSocketProvider } = configureChains(allChains, [
  alchemyProvider({ apiKey: alchemyId, priority: 0 }),
  infuraProvider({ apiKey: infuraId, priority: 1 }),
  publicProvider({ priority: 3 }),
]);

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
