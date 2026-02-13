import { createConfig, createStorage, cookieStorage } from "wagmi";
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
import { getDefaultConfig } from "connectkit";
import { ethereumPow } from "@/config/chains";
import { chainTransports } from "@/config/rpc";

const chains = [
  mainnet,
  polygon,
  bsc,
  avalanche,
  moonbeam,
  evmos,
  fantom,
  dogechain,
  okc,
  ethereumPow,
  base,
  pulsechain,
] as const;

export const config = createConfig({
  ...getDefaultConfig({
    chains,
    transports: {
      [mainnet.id]: chainTransports[mainnet.id],
      [polygon.id]: chainTransports[polygon.id],
      [bsc.id]: chainTransports[bsc.id],
      [avalanche.id]: chainTransports[avalanche.id],
      [moonbeam.id]: chainTransports[moonbeam.id],
      [evmos.id]: chainTransports[evmos.id],
      [fantom.id]: chainTransports[fantom.id],
      [dogechain.id]: chainTransports[dogechain.id],
      [okc.id]: chainTransports[okc.id],
      [ethereumPow.id]: chainTransports[ethereumPow.id],
      [base.id]: chainTransports[base.id],
      [pulsechain.id]: chainTransports[pulsechain.id],
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    appName: "Fenix Protocol",
    appDescription: "Burn XEN, Stake FENIX, Earn Trustless Yield",
    appUrl: "https://fenix.fyi",
    appIcon: "https://fenix.fyi/images/fenix-logo.svg",
  }),
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
