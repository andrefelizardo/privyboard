/* eslint-disable @next/next/no-img-element */
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface AssetCardProps {
  symbol: string;
  logo: string;
  name: string;
  tokenBalance: string;
  price: number;
  loading: boolean;
  priceChange: string;
}

export default function AssetCard({
  logo,
  symbol,
  name,
  tokenBalance,
  price,
  loading,
  priceChange,
}: AssetCardProps) {
  const beautyPrice = price == 0 ? " 0.01" : price.toFixed(2);
  const priceChangeNumber = parseFloat(priceChange);
  const priceChangeColor =
    priceChangeNumber > 0
      ? "text-green-500"
      : priceChangeNumber < 0
        ? "text-red-500"
        : "text-gray-500";
  const priceChangeSign = priceChangeNumber > 0 ? "+" : "";
  const priceChangePercent = priceChangeNumber.toFixed(2) + "%";
  const priceChangeIcon =
    priceChangeNumber > 0 ? (
      <TrendingUp />
    ) : priceChangeNumber < 0 ? (
      <TrendingDown />
    ) : null;
  return (
    <Card className="md:max-w-[215px] w-full">
      <CardContent className="px-4 flex flex-col justify-between items-center h-full">
        <div className="flex items-center space-x-4 sm:w-full">
          {loading ? (
            <Skeleton className="w-12 h-12 rounded-full" />
          ) : (
            <img src={logo} alt={symbol} className="w-12 h-12 rounded-full" />
          )}
          {loading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <h3 className="text-1xl">{name + " | " + symbol}</h3>
          )}
        </div>
        <div className="mt-4 mb-4 text-center">
          {loading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-3xl">$ {beautyPrice}</p>
          )}
          {loading ? (
            <Skeleton className="w-24 h-6 mt-2" />
          ) : (
            <p className="text-lg text-gray-500 pt-2">
              {parseFloat(tokenBalance).toFixed(4)} {symbol}
            </p>
          )}
        </div>
        {loading ? (
          <Skeleton className="w-24 h-6" />
        ) : (
          <p className={`flex items-center gap-2 text-lg ${priceChangeColor}`}>
            {priceChangeIcon}{" "}
            <span>
              {priceChangeSign} {priceChangePercent}
            </span>
            <span className="text-xs text-gray-500">(24h)</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
