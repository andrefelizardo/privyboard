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
import { useState } from "react";

export default function AddWalletDialog() {
  const addWallet = useWalletStore((state) => state.addWallet);
  const [walletAddress, setWalletAddress] = useState("");
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);

  function handleAddWallet() {
    //TODO: call API to add new wallet on database
    // [ ] Add wallet to database
    // [ ] Add wallet to store
    // [ ] refetch assets
  }

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
            onClick={() => addWallet}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
