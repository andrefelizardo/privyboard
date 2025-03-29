import { formatTokenBalancesPrice } from "@/lib/moralis/formatTokenBalancesPrice";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { NextRequest } from "next/server";

const NETWORKS = [
  {
    name: "polygon",
    chain: EvmChain.POLYGON,
  },
  {
    name: "ethereum",
    chain: EvmChain.ETHEREUM,
  },
  {
    name: "bsc",
    chain: EvmChain.BSC,
  },
];

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = (await request.json()) as { walletAddress: string };
    const walletAddress = body.walletAddress;
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });

    const promises = NETWORKS.map(async (network) => {
      const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice(
        {
          address: walletAddress,
          chain: network.chain,
        },
      );

      return formatTokenBalancesPrice(response.result, network.name);
    });

    const results = await Promise.all(promises);
    const tokens = results.flat();

    return new Response(
      JSON.stringify({
        tokens,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server error" }), {
      status: 500,
    });
  }
}
