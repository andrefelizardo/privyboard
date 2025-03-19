"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LoginContainer() {
  const router = useRouter();
  const { ready, authenticated, logout } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {
      router.push("/dashboard");
    },
  });

  const disableLogin = !ready || (ready && authenticated);
  const disableLogout = !ready || (ready && !authenticated);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-3xl">PrivyBoard</h1>
      <Button
        disabled={disableLogin}
        variant="outline"
        className="text-1xl mt-2"
        onClick={() =>
          login({
            loginMethods: ["wallet"],
            walletChainType: "ethereum-and-solana",
            disableSignup: false,
          })
        }
      >
        Login
      </Button>
      <Button disabled={disableLogout} onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
