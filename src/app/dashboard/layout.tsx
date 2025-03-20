import LoggedMenu from "@/components/LoggedMenu";
import PrivyBoardLogo from "@/components/PrivyBoardLogo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex justify-between items-center px-16 py-4">
        <PrivyBoardLogo />
        <LoggedMenu />
      </header>
      <main className="px-16">{children}</main>
    </>
  );
}
