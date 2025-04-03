import LoginContainer from "@/components/Login";
import PrivyBoardLogo from "@/components/PrivyBoardLogo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <Image
        src="/landing.png"
        fill
        style={{ filter: "opacity(0.5)", objectFit: "cover" }}
        alt="PrivyBoard concept"
      />
      <div className="relative z-10 gap-2 lg:gap-4 flex flex-col p-6 lg:p-12 w-full md:max-w-[60%]">
        <PrivyBoardLogo />
        <h2 className="text-6xl lg:text-[125px] font-semibold leading-none">
          Track,
          <br />
          Trade,
          <br />
          Thrive.
        </h2>
        <p className="text-2xl">
          PrivyBoard is your ultimate dashboard for managing digital assets
          efficiently. Track your wallets, analyze performance, and execute
          transactions securely—all in one place.
        </p>
        <LoginContainer />
        <p className="text-sm mt-2">© 2025 Lucky One. All rights reserved.</p>
      </div>
    </div>
  );
}
