import { formatTokenData } from "@/lib/alchemy/formatTokenData";

export const dynamic = "force-static";

export async function GET(walletAddress: string) {
  const API_KEY = process.env.ALCHEMY_API_KEY;

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
