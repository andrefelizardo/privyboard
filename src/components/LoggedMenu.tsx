"use client";

import { useLogout, usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  Copy,
  LayoutDashboard,
  LogOut,
  Wallet,
} from "lucide-react";
import { formatWalletAddress } from "@/lib/string";
import { toast } from "sonner";
import { useWalletStore } from "@/lib/store/useWalletStore";

export default function LoggedMenu() {
  const router = useRouter();
  const resetWallets = useWalletStore((state) => state.resetWallets);

  const { logout } = useLogout({
    onSuccess: () => {
      resetWallets();
      router.push("/");
    },
  });
  const { user } = usePrivy();

  if (!user) {
    return null;
  }

  function handleCopy() {
    navigator.clipboard.writeText(user?.wallet?.address as string);
    toast("Address copied to clipboard");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="group">
          <span>
            {formatWalletAddress(user?.wallet?.address as string) || "wallet"}
          </span>
          <ChevronDown className="ml-2 transition-transform duration-400 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={5}>
        <DropdownMenuItem>PrivyDashboard Account</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer flex"
            onSelect={handleCopy}
          >
            <Copy className="h-4 w-4" />
            <span>Copy address</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer flex"
            onSelect={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer flex"
            onSelect={() => router.push("/wallets")}
          >
            <Wallet className="h-4 w-4" />
            <span>Wallets</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer flex" onSelect={logout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
