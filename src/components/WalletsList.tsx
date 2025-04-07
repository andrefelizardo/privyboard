"use client";

// import { useWalletStore } from "@/lib/store/useWalletStore";
import { capitalize, formatWalletAddress } from "@/lib/string";
import ChainLogo from "@/components/ChainLogo";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { fetchUserWallets } from "@/lib/services/wallets";
import { Tables } from "../../database.types";

export default function WalletsList() {
  const { user } = usePrivy();

  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.WALLETS.USER_WALLETS(user?.id as string),
    queryFn: async () => fetchUserWallets(user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <span className="text-2xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full md:w-4/5 mx-auto px-4 py-12">
      <section className="flex flex-col gap-4">
        {data.map((wallet: Tables<"user_wallet_networks">) => (
          <div
            className="flex items-center justify-between min-h-[73px] px-6 py-4 bg-transparent border rounded-lg"
            key={`${wallet.wallet_address}-${wallet.network}`}
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center rounded-full bg-white p-2">
                <ChainLogo chain={wallet.network} />
              </span>
              <span>
                Wallet {capitalize(wallet.network || "")}{" "}
                {formatWalletAddress(wallet.wallet_address || "")}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-2xl">$ {wallet.balance?.toFixed(4)}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
