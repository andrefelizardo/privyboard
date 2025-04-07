"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/lib/store/useWalletStore";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { fetchWallets } from "@/lib/services/wallets";
import { fetchCreateUser } from "@/lib/services/user";

export default function LoginContainer() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const [allowCreate, setAllowCreate] = useState(false);
  const [oldUser, setOldUser] = useState(false);

  const setWallets = useWalletStore((state) => state.setWallets);

  const { login } = useLogin({
    onComplete: (user) => {
      if (user && !user.isNewUser) {
        setOldUser(true);
      }

      if (user && user.isNewUser) {
        setAllowCreate(true);
      }
    },
  });

  const {
    data: walletsData,
    isSuccess: walletsSuccess,
    isFetched,
  } = useQuery({
    queryKey: QUERY_KEYS.WALLETS.GET(user?.id as string),
    queryFn: async () => fetchWallets(user?.id as string),
    refetchOnWindowFocus: false,
    enabled: oldUser && !!user?.wallet?.address,
  });

  useEffect(() => {
    if (isFetched) {
      setOldUser(false);
    }
  }, [isFetched]);

  useEffect(() => {
    if (walletsSuccess && walletsData && walletsData.wallets) {
      setWallets(walletsData.wallets);
      setAllowCreate(false);
      router.push("/dashboard");
    }
  }, [walletsSuccess, walletsData, router, setWallets]);

  const { isPending, isSuccess, data, isError } = useQuery({
    queryKey: QUERY_KEYS.USER.CREATE(user?.id as string),
    queryFn: async () =>
      fetchCreateUser(user?.id as string, user?.wallet?.address as string),
    refetchOnWindowFocus: false,
    enabled: allowCreate && !!user,
  });

  useEffect(() => {
    if (isSuccess && data && data.wallets) {
      setWallets(data.wallets);
      setAllowCreate(false);
      router.push("/dashboard");
    }
  }, [isSuccess, data, router, setWallets]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching user data:");
      setAllowCreate(false);
    }
  }, [isError]);
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
