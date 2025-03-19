import LoginContainer from "@/components/Login";

export default async function Page() {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <LoginContainer />
    </main>
  );
}
