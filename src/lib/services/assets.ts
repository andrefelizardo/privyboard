import { Tables } from "../../../database.types";

export async function fetchAssets(wallets: Tables<"wallets">[]) {
  const response = await fetch("/api/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallets }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Bad Request");
  }

  return await response.json();
}
