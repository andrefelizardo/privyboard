import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return new Response(JSON.stringify({ error: "User is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string
    );

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("privy_id", query)
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
      .select("*")
      .eq("user_id", userData.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!data) {
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return new Response(JSON.stringify({ wallets: data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server error" }), {
      status: 500,
    });
  }
}
