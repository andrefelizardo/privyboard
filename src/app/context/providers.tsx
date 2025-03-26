"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "default-app-id"}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || "default-client-id"}
      config={{
        // appearance: {
        //   theme: "light",
        //   accentColor: "#676FFF",
        //   logo: "https://your-logo-url",
        // },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </PrivyProvider>
  );
}
