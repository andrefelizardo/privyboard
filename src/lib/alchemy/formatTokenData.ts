import { ethers } from "ethers";

interface TokenPrice {
  currency: string;
  value: string;
  lastUpdatedAt: Date;
}

interface TokenMetadata {
  symbol: string;
  decimals: number;
  name: string;
  logo: string;
}

interface TokenPrices {
  network: string;
  address: string;
  prices: TokenPrice[];
  error: string | null;
}

interface TokenData {
  network: string;
  address: string;
  tokenAddress: string;
  tokenBalance: string;
  tokenMetadata: TokenMetadata;
  tokenPrices: TokenPrices;
}

interface TokenDataResponse {
  data: {
    tokens: TokenData[];
  };
}

export function formatTokenData(rawData: TokenDataResponse) {
  const tokens = rawData.data.tokens;

  return tokens.map((token: TokenData) => {
    const decimals = token.tokenMetadata.decimals || 18;
    const balance = ethers.formatUnits(token.tokenBalance, decimals);

    const usdPrice = token.tokenPrices.prices.find(
      (price) => price.currency === "usd"
    );
    const price = usdPrice ? parseFloat(usdPrice.value) : 0;

    return {
      network: token.network,
      address: token.address,
      symbol: token.tokenMetadata.symbol,
      logo: token.tokenMetadata.logo,
      name: token.tokenMetadata.name,
      tokenAddress: token.tokenAddress,
      tokenBalance: balance,
      tokenMetadata: token.tokenMetadata,
      tokenPrices: token.tokenPrices,
      price,
    };
  });
}
