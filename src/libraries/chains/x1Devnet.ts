import { Chain } from "wagmi";

export const x1Devnet: Chain = {
  id: 202212,
  name: "X1 Devnet",
  network: "X1",
  nativeCurrency: {
    name: "XN",
    symbol: "XN",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://x1-devnet.xen.network"],
    },
    public: {
      http: ["https://x1-devnet.xen.network"],
    },
  },
  blockExplorers: {
    default: { name: "X1 Explorer", url: "https://explorer.x1-devnet.xen.network" },
  },
  testnet: true,
};
