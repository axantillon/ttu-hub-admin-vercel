import NavBar from "@/components/layout/NavBar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative flex w-dvw h-dvh">
      <NavBar />
      <div className="flex flex-col flex-1 h-dvh p-10">{children}</div>
    </main>
  );
}
