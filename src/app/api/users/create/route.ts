import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.walletAddress || !body.id) {
      return new Response(
        JSON.stringify({ error: "Wallet address and ID are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string,
    );

    const { data, error } = await supabase
      .from("users")
      .insert({
        privy_id: body.id,
      })
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .insert({
        user_id: data[0].id,
        wallet_address: body.walletAddress,
        chain: "ethereum",
        is_primary: true,
      })
      .select();

    if (walletError) {
      return new Response(JSON.stringify({ error: walletError?.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (data && walletData) {
      console.log(walletData);
      return new Response(
        JSON.stringify({ success: true, wallets: walletData }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Unhandled error" }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
