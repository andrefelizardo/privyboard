import AddWalletDialog from "@/components/AddWalletDialog";
import WalletsList from "@/components/WalletsList";

export default async function Page() {
  return (
    <>
      <main>
        <div className="w-full mb-8 flex justify-end">
          <AddWalletDialog />
        </div>
        <WalletsList />
      </main>
    </>
  );
}
