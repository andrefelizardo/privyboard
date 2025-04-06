import {
  FormattedTokenBalancePrice,
  formatTokenBalancesPrice,
} from "@/lib/moralis/formatTokenBalancesPrice";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { NextRequest } from "next/server";
import { Tables } from "../../../../database.types";
import { createClient } from "@supabase/supabase-js";

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
      (wallet) =>
        wallet.chain?.toLowerCase() === "ethereum" &&
        wallet.wallet_address &&
        wallet.user_id
    );

    const walletResults = await Promise.all(
      evmWallets.map(async (wallet) => {
        const address = wallet.wallet_address!;
        const tokens = await fetchTokensForEVMAddress(address);

        const networkAggregation = tokens.reduce(
          (acc, token) => {
            const network = token.network;
            if (!acc[network]) {
              acc[network] = 0;
            }
            acc[network] += parseFloat(token.balance);
            return acc;
          },
          {} as Record<string, number>
        );

        const networkData = Object.keys(networkAggregation).map((network) => ({
          user_id: wallet.user_id,
          wallet_address: address,
          network,
          balance: networkAggregation[network],
        }));

        return { tokens, networkData };
      })
    );
    const allTokens = walletResults.flatMap((result) => result.tokens);
    const mergedTokens = mergeTokens(allTokens);
    mergedTokens.sort((a, b) => {
      return b.usd_value - a.usd_value;
    });

    const walletDataAggregated = walletResults.flatMap(
      (result) => result.networkData
    );

    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    if (walletDataAggregated.length > 0) {
      const { error } = await supabase
        .from("user_wallet_networks")
        .upsert(walletDataAggregated, {
          onConflict: "user_id,wallet_address,network",
        });
      if (error) {
        console.error("Error upserting user_wallet_networks:", error);
      }
    }

    return new Response(
      JSON.stringify({
        tokens: mergedTokens,
        wallets: walletDataAggregated,
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
): Promise<FormattedTokenBalancePrice[]> {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      address: address as string,
      chain: network.chain,
    });

    const tokens = formatTokenBalancesPrice(response.result, network.name);
    const filteredTokens = tokens.filter(
      (token) => parseFloat(token.balance) > 0
    );
    return filteredTokens.map((token) => ({
      ...token,
      wallet_address: address,
    }));
  } catch (error) {
    console.error(
      `Error fetching tokens for ${address} on ${network.name}:`,
      error
    );
    return [];
  }
}

async function fetchTokensForEVMAddress(
  address: string
): Promise<FormattedTokenBalancePrice[]> {
  const promises = EVM_NETWORKS.map((network) =>
    fetchEVMTokensForAddress(address, network)
  );
  const results = await Promise.all(promises);
  return results.flat();
}

function mergeTokens(
  tokens: FormattedTokenBalancePrice[]
): FormattedTokenBalancePrice[] {
  const merged = tokens.reduce(
    (acc, token) => {
      const key = token.symbol;
      if (!acc[key]) {
        acc[key] = { ...token };
      } else {
        acc[key].usd_value += token.usd_value;

        const currentBalance = parseFloat(acc[key].balance);
        const newBalance = parseFloat(token.balance);
        acc[key].balance = (currentBalance + newBalance).toFixed(4);
      }
      return acc;
    },
    {} as { [key: string]: FormattedTokenBalancePrice }
  );

  return Object.values(merged);
}
