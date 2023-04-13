"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiConfig } from "wagmi";
import { client } from "@/libraries/client";
import { FenixProvider } from "@/contexts/FenixContext";

export default function GlobalContainer({ children }: any) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        options={{
          initialChainId: 0,
          disclaimer: (
            <>
              By connecting your wallet you agree to the
              <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Terms_of_service">
                Terms of Service
              </a>
              and
              <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Privacy_policy">
                Privacy Policy
              </a>
            </>
          ),
        }}
      >
        <FenixProvider>{children}</FenixProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
