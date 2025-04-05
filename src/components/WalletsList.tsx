"use client";
import { useWalletStore } from "@/lib/store/useWalletStore";

export default function WalletsList() {
  const wallets = useWalletStore((state) => state.wallets);

  return (
    <div className="flex flex-col gap-4">
      {wallets.map((wallet) => (
        <div className="flex items-center gap-8" key={wallet.wallet_address}>
          <div>chain icone</div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <span>
              {wallet.chain ? wallet.chain[0].toUpperCase() : "Wallet"}{" "}
              {wallet.wallet_address}
            </span>
          </div>
          <div>
            <span>Gostaria de exibir o balance aqui</span>
          </div>
        </div>
      ))}
    </div>
  );
}
