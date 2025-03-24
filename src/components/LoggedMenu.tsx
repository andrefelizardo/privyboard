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
import { ChevronDown, Copy, LogOut } from "lucide-react";
import { formatAddress } from "@/lib/formatAddress";
import { toast } from "sonner";

export default function LoggedMenu() {
  const router = useRouter();
  const { logout } = useLogout({ onSuccess: () => router.push("/") });
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
            {formatAddress(user?.wallet?.address as string) || "wallet"}
          </span>
          <ChevronDown className="ml-2 transition-transform duration-400 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={5}>
        <DropdownMenuItem>PrivyDashboard Account</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer flex items-between"
            onSelect={handleCopy}
          >
            <Copy className="h-4 w-4" />
            <span>Copy address</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer flex items-between"
            onSelect={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
