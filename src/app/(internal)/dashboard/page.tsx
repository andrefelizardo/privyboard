import AddWalletDialog from "@/components/AddWalletDialog";
import AssetCardsList from "@/components/AssetCardsList";

export default async function Page() {
  return (
    <>
      <div className="w-full mb-8 flex justify-end">
        <AddWalletDialog />
      </div>
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 sm:px-0">
        <AssetCardsList />
      </div>
    </>
  );
}
