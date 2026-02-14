import { createConfig, createStorage, cookieStorage } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { SUPPORTED_CHAINS } from "@/config/chains";
import { chainTransports } from "@/config/rpc";

const chains = SUPPORTED_CHAINS as unknown as readonly [
  (typeof SUPPORTED_CHAINS)[0],
  ...typeof SUPPORTED_CHAINS,
];

const transports: Record<number, (typeof chainTransports)[number]> =
  Object.fromEntries(
    SUPPORTED_CHAINS.map((chain) => [chain.id, chainTransports[chain.id]]),
  );

export const config = createConfig({
  ...getDefaultConfig({
    chains,
    transports,
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
