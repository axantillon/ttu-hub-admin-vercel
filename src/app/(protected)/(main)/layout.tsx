import NavBar from "@/components/layout/NavBar";
import { ProfileBtn } from "@/components/layout/ProfileBtn";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex w-dvw h-dvh">
      <NavBar />
      <div className="relative flex flex-col w-[calc(100dvw-12rem)] h-dvh p-10 pt-16 overflow-auto">
        <div className="absolute top-8 right-10">
          <ProfileBtn />
        </div>
        {children}
      </div>
    </main>
  );
}
