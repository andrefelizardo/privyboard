import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tables } from "../../../database.types";

export interface WalletState {
  wallets: Tables<"wallets">[];
  setWallets: (wallets: Tables<"wallets">[]) => void;
  addWallet: (wallet: Tables<"wallets">) => void;
  removeWallet: (walletAddress: string) => void;
  resetWallets: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist<WalletState>(
    (set) => ({
      wallets: [],
      setWallets: (wallets: Tables<"wallets">[]) => set({ wallets }),
      addWallet: (wallet: Tables<"wallets">) =>
        set((state) => ({
          wallets: [...state.wallets, wallet],
        })),
      removeWallet: (walletAddress: string) =>
        set((state) => ({
          wallets: state.wallets.filter(
            (wallet) => wallet.wallet_address !== walletAddress,
          ),
        })),
      resetWallets: () => set({ wallets: [] }),
    }),
    {
      name: "wallet-store",
    },
  ),
);
