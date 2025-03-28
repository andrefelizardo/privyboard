"use client";

import { useQuery } from "@tanstack/react-query";
import AssetCard from "./AssetCard";
import { usePrivy } from "@privy-io/react-auth";
import { FormattedTokenBalancePrice } from "@/lib/moralis/formatTokenBalancesPrice";

export default function AssetCardsList() {
  const { user } = usePrivy();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["my-assets"],
    queryFn: async () => {
      const response = await fetch(`/api/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: "0xF5b4172C5a42418971130c5e24743355f1d4043C",
        }),
        // body: JSON.stringify({ walletAddress:  user?.wallet?.address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bad Request");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: !!user?.wallet?.address,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AssetCard
          logo="--"
          symbol="--"
          name="--"
          tokenBalance={"--"}
          price={0}
          loading={isPending}
        />
        <AssetCard
          logo="--"
          symbol="--"
          name="--"
          tokenBalance={"--"}
          price={0}
          loading={isPending}
        />
        <AssetCard
          logo="--"
          symbol="--"
          name="--"
          tokenBalance={"--"}
          price={0}
          loading={isPending}
        />
        <AssetCard
          logo="--"
          symbol="--"
          name="--"
          tokenBalance={"--"}
          price={0}
          loading={isPending}
        />
      </div>
    );
  }

  if (isError) {
    console.log("error", error);
    return <div>Error fetching data: {error.message}</div>;
  }

  if (data.tokens.length === 0) {
    return <div>No assets found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.tokens.map((token: FormattedTokenBalancePrice) => (
        <AssetCard
          key={token.address + token.symbol}
          logo={token.logo}
          symbol={token.symbol}
          name={token.name}
          tokenBalance={token.balance}
          price={token.usd_value}
          loading={isPending}
        />
      ))}
    </div>
  );
}
