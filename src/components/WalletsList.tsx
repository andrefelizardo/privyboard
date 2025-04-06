"use client";
import { useWalletStore } from "@/lib/store/useWalletStore";
import { capitalize, formatWalletAddress } from "@/lib/string";
import ChainLogo from "@/components/ChainLogo";

export default function WalletsList() {
  const wallets = useWalletStore((state) => state.wallets);

  return (
    <div className="flex flex-row gap-48 pb-12 lg:py-12">
      <section className="flex flex-col gap-4">
        {wallets.map((wallet) => (
          <div
            className="flex items-center gap-12 min-h-[73px] py-8 bg-transparent px-16 sm:min-w-[400px] border rounded-lg"
            key={wallet.wallet_address}
          >
            <span className="flex flex-col items-center rounded-full cover bg-white p-2">
              <ChainLogo chain={wallet.chain} />
            </span>
            <div className="flex items-center justify-between p-4">
              <span>
                Wallet {capitalize(wallet.chain || "")}{" "}
                {formatWalletAddress(wallet.wallet_address || "")}
              </span>
            </div>
            <div>
              <span>$ 100.000</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
