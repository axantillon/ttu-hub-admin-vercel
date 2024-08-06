import NavBar from "@/components/layout/NavBar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex w-dvw h-dvh">
      <NavBar />
      <div className="relativeflex flex-col w-[calc(100dvw-12rem)] h-dvh p-10 pt-16 overflow-auto">{children}</div>
    </main>
  );
}
