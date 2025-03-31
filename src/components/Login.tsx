"use client";

import { useLogin, usePrivy, User } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function LoginContainer() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const [allowCreate, setAllowCreate] = useState(false);

  const { login } = useLogin({
    onComplete: (user: User | null) => {
      if (user && !user.isNewUser) {
        router.push("/dashboard");
      }

      if (user && user.isNewUser) {
        setAllowCreate(true);
      }
    },
  });

  const { isPending } = useQuery({
    queryKey: ["create-user"],
    queryFn: async () => {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: user.wallet?.address,
          id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bad Request");
      }
      router.push("/dashboard");
      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: allowCreate && user.isNewUser,
  });

  const disableLogin =
    !ready || (ready && authenticated) || (isPending && allowCreate);

  return (
    <Button
      disabled={disableLogin}
      className="text-1xl mt-2 w-full p-8 text-left flex justify-between cursor-pointer"
      onClick={() =>
        login({
          loginMethods: ["wallet"],
          walletChainType: "ethereum-and-solana",
          disableSignup: false,
        })
      }
    >
      <span>Enter now</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </Button>
  );
}
