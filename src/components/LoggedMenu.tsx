"use client";

import { useLogout } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LoggedMenu() {
  const router = useRouter();
  const { logout } = useLogout({ onSuccess: () => router.push("/") });

  return <Button onClick={logout}>Logout</Button>;
}
