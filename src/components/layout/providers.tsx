"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { ThemeProvider } from "next-themes";
import { config } from "@/lib/wagmi";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5_000,
            refetchInterval: 15_000,
            retry: 2,
            retryDelay: 1_000,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiProvider config={config} reconnectOnMount>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider
            theme="midnight"
            customTheme={{
              "--ck-accent-color": "#f97316",
              "--ck-accent-text-color": "#ffffff",
            }}
          >
            {children}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
