import { formatTokenBalancesPrice } from "@/lib/moralis/formatTokenBalancesPrice";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { NextRequest } from "next/server";
import { Tables } from "../../../../database.types";

export interface AssetsRequestBody {
  wallets: Tables<"wallets">[];
}

const EVM_NETWORKS = [
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
    const body = (await request.json()) as AssetsRequestBody;
    const wallets = body.wallets;
    if (!wallets || wallets.length === 0) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    try {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });
    } catch (error) {
      console.error("Error starting Moralis:", error);
    }

    const evmWallets = wallets.filter(
      (wallet) => wallet.chain?.toLowerCase() === "ethereum"
    );

    const tokensPromises = evmWallets.map((wallet) =>
      fetchTokensForEVMAddress(wallet.wallet_address as string)
    );
    const tokensNested = await Promise.all(tokensPromises);
    const tokens = tokensNested.flat();

    tokens.sort((a, b) => {
      return b.usd_value - a.usd_value;
    });

    return new Response(
      JSON.stringify({
        tokens,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server error" }), {
      status: 500,
    });
  }
}

async function fetchEVMTokensForAddress(
  address: string,
  network: { name: string; chain: EvmChain }
): Promise<any[]> {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      address: address as string,
      chain: network.chain,
    });

    const tokens = formatTokenBalancesPrice(response.result, network.name);
    return tokens.map((token) => ({ ...token, wallet_address: address }));
  } catch (error) {
    console.error(
      `Error fetching tokens for ${address} on ${network.name}:`,
      error
    );
    return [];
  }
}

async function fetchTokensForEVMAddress(address: string): Promise<any[]> {
  const promises = EVM_NETWORKS.map((network) =>
    fetchEVMTokensForAddress(address, network)
  );
  const results = await Promise.all(promises);
  return results.flat();
}
