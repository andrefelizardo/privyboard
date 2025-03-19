"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LoginContainer() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {
      router.push("/dashboard");
    },
  });

  const disableLogin = !ready || (ready && authenticated);

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
