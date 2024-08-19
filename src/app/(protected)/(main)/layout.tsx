import NavBar from "@/components/layout/NavBar";
import { ProfileBtn } from "@/components/layout/ProfileBtn";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative flex flex-col md:flex-row w-dvw h-dvh">
      <NavBar />
      <div className="z-0 flex flex-col w-full md:w-[calc(100dvw-12rem)] h-dvh p-4 md:p-10 pt-20 overflow-auto">
        <div className="z-20 absolute top-6 right-4 md:right-10">
          <ProfileBtn />
        </div>
        {children}
      </div>
    </main>
  );
}