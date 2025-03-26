import { formatTokenData } from "@/lib/alchemy/formatTokenData";
import { NextRequest } from "next/server";

export const dynamic = "force-static";

export async function POST(request: NextRequest): Promise<Response> {
  const API_KEY = process.env.ALCHEMY_API_KEY;

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
      }
    );
  }

  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      addresses: [
        {
          address: walletAddress,
          networks: [
            "eth-mainnet",
            "bnb-mainnet",
            "polygon-mainnet",
            "zksync-mainnet",
            "arb-mainnet",
            "linea-mainnet",
            "avax-mainnet",
          ],
        },
      ],
      withMetadata: true,
      withPrices: true,
    }),
  };

  try {
    const response = await fetch(
      `https://api.g.alchemy.com/data/v1/${API_KEY}/assets/tokens/by-address`,
      options
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Bad Request" }), {
        status: 400,
      });
    }

    const rawData = await response.json();
    const data = formatTokenData(rawData);

    return new Response(
      JSON.stringify({
        tokens: data,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
