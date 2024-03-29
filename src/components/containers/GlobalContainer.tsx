"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiConfig } from "wagmi";
import { client } from "@/libraries/client";
import { FenixProvider } from "@/contexts/FenixContext";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Analytics } from "@vercel/analytics/react";
import QueryProvider from "@/contexts/QueryProvider";

export default function GlobalContainer({ children }: any) {
  return (
    <WagmiConfig client={client}>
      <QueryProvider>
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
          <FenixProvider>
            <GoogleAnalytics trackPageViews />
            {children}
            <Analytics />
          </FenixProvider>
        </ConnectKitProvider>
      </QueryProvider>
    </WagmiConfig>
  );
}
