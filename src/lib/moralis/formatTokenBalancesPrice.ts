import { EvmErc20TokenBalanceWithPrice } from "@moralisweb3/common-evm-utils";

export interface FormattedTokenBalancePrice {
  network: string;
  address: string;
  symbol: string;
  logo: string;
  name: string;
  thumbnail: string;
  balance: string;
  usd_value: number;
  usd_price_24hr_percent_change: number;
}

export function formatTokenBalancesPrice(
  tokens: EvmErc20TokenBalanceWithPrice[],
  network: string
) {
  const tokensValidContracts = tokens.filter(
    (token) => token.verifiedContract === true
  );

  return tokensValidContracts.map((token) => {
    return {
      network: network,
      address: token.tokenAddress,
      symbol: token.symbol,
      logo: token.logo,
      name: token.name,
      thumbnail: token.thumbnail,
      balance: token.balanceFormatted,
      usd_value: token.usdValue,
      usd_price_24hr_percent_change: token.usdPrice24hrPercentChange,
    };
  });
}
