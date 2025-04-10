"use client";

import { capitalize, formatWalletAddress } from "@/lib/string";
import ChainLogo from "@/components/ChainLogo";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { fetchUserWallets } from "@/lib/services/wallets";
import { Tables } from "../../database.types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useState } from "react";

export default function WalletsList() {
  const { user } = usePrivy();
  //juntar esses dois estados abaixo em um só
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.WALLETS.USER_WALLETS(user?.id as string),
    queryFn: async () => fetchUserWallets(user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });

  const {
    data: removeData,
    isPending: isRemovePending,
    isSuccess: isRemoveSuccess,
  } = useQuery({
    queryKey: QUERY_KEYS.WALLETS.REMOVE_WALLET(
      user?.id as string,
      walletAddress
    ),
    queryFn: async () => fetchUserWallets(user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!user?.id && confirmRemove && !!walletAddress,
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
        <h1 className="text-3xl font-bold">Wallets: {data.length}</h1>
        {data.map((wallet: Tables<"user_wallet_networks">) => {
          const walletName = `Wallet ${capitalize(wallet.network || "")} ${formatWalletAddress(wallet.wallet_address || "")}`;

          return (
            <div
              className="flex items-center justify-between min-h-[73px] px-6 py-4 bg-transparent border rounded-lg"
              key={`${wallet.wallet_address}-${wallet.network}`}
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center rounded-full bg-white p-2">
                  <ChainLogo chain={wallet.network} />
                </span>
                <span>{wallet.name || walletName}</span>
              </div>

              <div className="flex">
                <span className="text-2xl">$ {wallet.balance?.toFixed(4)}</span>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="p-4">
                    <SheetHeader>
                      <SheetTitle className="text-2xl">
                        Manage Wallet
                      </SheetTitle>
                      <SheetDescription className="text-1xl">
                        {walletName}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 w-80%">
                      <span className="flex w-16 h-16 items-center justify-center rounded-full bg-white p-2 m-auto mb-4 mt-4">
                        <ChainLogo chain={wallet.network} />
                      </span>
                      <p className="text-2xl m-auto">
                        Total value: ${wallet.balance?.toFixed(4)}
                      </p>
                      <Button>Rename wallet</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Remove wallet</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to remove this wallet?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will remove the
                              wallet from your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setConfirmRemove(true);
                                setWalletAddress(
                                  wallet.wallet_address as string
                                );
                              }}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
