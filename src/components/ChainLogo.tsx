import { Tables } from "../../database.types";
import Image from "next/image";
interface ChainLogoProps {
  chain: Tables<"wallets">["chain"];
}

const chainLogos = {
  ethereum: { src: "/images/chains/ethereum-logo.svg", alt: "Ethereum" },
  bitcoin: { src: "/images/chains/bitcoin-logo.svg", alt: "Bitcoin" },
  solana: { src: "/images/chains/solana-logo.svg", alt: "Solana" },
  polygon: { src: "/images/chains/polygon-logo.svg", alt: "Polygon" },
  binance: { src: "/images/chains/bnb-logo.svg", alt: "Binance" },
  default: { src: "/images/chains/ethereum-logo.svg", alt: "Default" },
};

export default function ChainLogo({ chain }: ChainLogoProps) {
  const key = chain ? chain.toLowerCase() : "default";
  const validKey: keyof typeof chainLogos =
    key in chainLogos ? (key as keyof typeof chainLogos) : "default";

  const { src, alt } = chainLogos[validKey] ?? {
    src: "/images/chains/default-logo.svg",
    alt: "Default",
  };

  return (
    <Image src={src} alt={alt} width={32} height={32} className="w-8 h-8" />
  );
}
