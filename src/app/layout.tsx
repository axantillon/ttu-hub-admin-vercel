import { GlobalProviders } from "@/lib/providers";
import "@/lib/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // TODO: Update metadata
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="block sm:hidden">
          <GlobalProviders>{children}</GlobalProviders>
        </div>
        <div className="hidden sm:flex justify-center items-center h-dvh w-dvw">
          <span>Come back on mobile...</span>
        </div>
      </body>
    </html>
  );
}
