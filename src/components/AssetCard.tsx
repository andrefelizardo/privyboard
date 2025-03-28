/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface AssetCardProps {
  symbol: string;
  logo: string;
  name: string;
  tokenBalance: string;
  price: number;
  loading: boolean;
}

export default function AssetCard({
  logo,
  symbol,
  name,
  tokenBalance,
  price,
  loading,
}: AssetCardProps) {
  const beautyPrice = price == 0 ? " 0.01" : price.toFixed(2);

  return (
    <Card className="max-w-[215px] w-full">
      <CardContent className="px-4 flex flex-col justify-between items-center ">
        <div className="flex items-center space-x-4 w-full">
          {loading ? (
            <Skeleton />
          ) : (
            <img src={logo} alt={symbol} className="w-12 h-12" />
          )}
          {loading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <h3 className="text-1xl">{name + " | " + symbol}</h3>
          )}
        </div>
        <div className="py-8 text-center">
          {loading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-3xl">$ {beautyPrice}</p>
          )}
          {loading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-lg text-gray-500 pt-2">
              {parseFloat(tokenBalance).toFixed(4)} {symbol}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
