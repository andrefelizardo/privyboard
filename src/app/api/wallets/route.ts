import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.wallet || !body.user_id) {
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

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("privy_id", body.user_id)
      .single();

    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { data, error } = await supabase
      .from("wallets")
      .insert({
        user_id: userData.id,
        wallet_address: body.wallet,
        chain: "ethereum",
        is_primary: false,
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

    if (data) {
      return new Response(JSON.stringify({ wallet: data[0] }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Internal Server error" }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
