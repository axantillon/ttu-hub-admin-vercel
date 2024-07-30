import NavBar from "@/components/layout/NavBar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative flex w-dvw h-dvh">
      <NavBar />
      <div className="flex flex-col w-[calc(100dvw-12rem)] h-dvh p-10 pt-16 overflow-auto">{children}</div>
    </main>
  );
}
