import Image from "next/image";

export default function PrivyBoardLogo() {
  return (
    <Image
      width={270}
      height={270}
      src="/PrivyBoard-logo-full-white.png"
      quality={100}
      sizes="(max-width: 720px) 100px, 100px"
      alt="PrivyBoard"
    />
  );
}
