"use client";

import { useWalletStore } from "@/lib/store/useWalletStore";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export default function AddWalletDialog() {
  const addWallet = useWalletStore((state) => state.addWallet);
  const wallets = useWalletStore((state) => state.wallets);
  const [walletAddress, setWalletAddress] = useState("");
  const [create, setCreate] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const { user } = usePrivy();

  function validateWallet() {
    if (wallets.some((wallet) => wallet.wallet_address === walletAddress)) {
      setError(true);
      setWalletAddress("");
    } else {
      setCreate(true);
    }
  }

  const { data, isSuccess } = useQuery({
    queryKey: ["add-wallet", user?.id, walletAddress],
    queryFn: async () => {
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: walletAddress,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bad Request");
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: create && !!user?.id && isValidAddress,
  });

  useEffect(() => {
    if (isSuccess && data && data.wallet) {
      addWallet(data.wallet);
      setWalletAddress("");
      setOpen(false);
    }
  }, [addWallet, data, isSuccess]);

  return (
    <>
      <AlertDialog open={error} onOpenChange={setError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wallet already exists</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This wallet address is already in your list. Please add a different
            one.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-1xl"
            onClick={() => setOpen(true)}
          >
            + Add wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Type wallet address</DialogTitle>
            <DialogDescription>
              Insert a valid EVM wallet address
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="wallet-address">Wallet address</Label>
            <Input
              id="wallet-address"
              className="col-span-3"
              placeholder="0x..."
              onChange={(e) => setWalletAddress(e.target.value)}
              value={walletAddress}
              type="text"
              required
              pattern="0x[a-fA-F0-9]{40}"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!isValidAddress}
              onClick={validateWallet}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
