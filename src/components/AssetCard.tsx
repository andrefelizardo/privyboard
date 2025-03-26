/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "./ui/card";

interface AssetCardProps {
  symbol: string;
  logo: string;
  name: string;
  tokenBalance: number;
  price: number;
}

export default function AssetCard({
  logo,
  symbol,
  name,
  tokenBalance,
  price,
}: AssetCardProps) {
  return (
    <Card className="max-w-[215px] w-full">
      <CardContent className="px-4 flex flex-col justify-between items-center ">
        <div className="flex items-center space-x-4 w-full">
          <img src={logo} alt={symbol} className="w-12 h-12" />
          <h3 className="text-1xl">{name + " | " + symbol}</h3>
        </div>
        <div className="py-8 text-center">
          <p className="text-3xl">$ {price}</p>
          <p className="text-lg text-gray-500 pt-2">
            {tokenBalance} {symbol}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
