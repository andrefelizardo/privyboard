export const QUERY_KEYS = {
  ASSETS: {
    MY_ASSETS: "my-assets",
  },
  WALLETS: {
    USER_WALLETS: (userId: string) => ["user-wallets", userId],
    ADD: (userId: string, walletAddress: string) => [
      "add-wallet",
      userId,
      walletAddress,
    ],
    GET: (userId: string) => ["wallets", userId],
    CREATE: "wallets/create",
    REMOVE_WALLET: (userId: string, walletAddress: string) => [
      "user-wallets/delete",
      userId,
      walletAddress,
    ],
  },
  USER: {
    GET: "users/get",
    CREATE: (userId: string) => ["create-user", userId],
  },
  TRANSACTIONS: {
    GET: "transactions/get",
  },
  TOKENS: {
    GET: "tokens/get",
  },
};
