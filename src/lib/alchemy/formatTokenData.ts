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
interface TokenData {
  network: string;
  address: string;
  tokenAddress: string;
  tokenBalance: string;
  tokenMetadata: TokenMetadata;
  tokenPrices: TokenPrice[];
}

interface TokenDataResponse {
  data: {
    tokens: TokenData[];
  };
}

export interface FormattedTokenData {
  network: string;
  address: string;
  tokenAddress: string;
  symbol: string;
  logo: string;
  name: string;
  tokenBalance: string;
  tokenMetadata: TokenMetadata;
  tokenPrices: TokenPrice[];
  price: number;
}

export function formatTokenData(rawData: TokenDataResponse) {
  const tokens = rawData.data.tokens;

  const formattedTokens = tokens.map((token: TokenData) => {
    const decimals = token.tokenMetadata.decimals || 18;
    const balance = ethers.formatUnits(token.tokenBalance, decimals);

    if (parseFloat(balance) === 0) {
      return null;
    }

    if (token.tokenPrices.length === 0) {
      return null;
    }

    const usdPrice = token.tokenPrices.find(
      (price) => price.currency === "usd"
    );
    const price = usdPrice ? parseFloat(usdPrice.value) : 1;

    return {
      network: token.network,
      address: token.address,
      symbol: token.tokenMetadata.symbol,
      logo: token.tokenMetadata.logo,
      name: token.tokenMetadata.name,
      tokenAddress: token.tokenAddress,
      tokenBalance: parseFloat(balance).toFixed(6).toString(),
      tokenMetadata: token.tokenMetadata,
      tokenPrices: token.tokenPrices,
      price: parseFloat((parseFloat(balance) * price).toFixed(4)),
    };
  });

  return formattedTokens.filter(
    (token): token is FormattedTokenData => token !== null
  );
}
