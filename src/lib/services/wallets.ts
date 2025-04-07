export async function fetchUserWallets(userId: string) {
  const response = await fetch(`/api/wallets/user?query=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user wallets");
  }
  return await response.json();
}

export async function fetchAddWallet(userId: string, walletAddress: string) {
  const response = await fetch("/api/wallets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wallet: walletAddress,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Bad Request");
  }

  return await response.json();
}

export async function fetchWallets(userId: string) {
  const response = await fetch(`/api/wallets/get?query=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch wallets");
  }
  return await response.json();
}
