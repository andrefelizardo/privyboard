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

export default function AddWalletDialog() {
  const addWallet = useWalletStore((state) => state.addWallet);
  const [walletAddress, setWalletAddress] = useState("");
  const [create, setCreate] = useState(false);
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const { user } = usePrivy();

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
    }
  }, [addWallet, data, isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-1xl">
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
            onClick={() => setCreate(true)}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
