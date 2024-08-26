import { Toaster } from "@/components/ui/shadcn/toaster";
import { GlobalProviders } from "@/lib/providers";
import "@/lib/styles/globals.css";
import { cn } from "@/lib/utils/cn";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";

const APP_NAME = "Admin - TTU@CR Hub";
const APP_DEFAULT_TITLE = "Admin Dashboard for TTU@CR Hub";
const APP_TITLE_TEMPLATE = "%s - TTU@CR Hub";
const APP_DESCRIPTION =
  "The place to catch up on Campus Events, Student Organizations & fellow Students at the TTU@CR Campus. Built for Students, by Students.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: [{ url: "/icons/favicon.ico" }],
    apple: [
      { url: "/icons/apple-touch-icon-76x76.png", sizes: "76x76" },
      { url: "/icons/apple-touch-icon-120x120.png", sizes: "120x120" },
      { url: "/icons/apple-touch-icon-144x144.png", sizes: "144x144" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(montserrat.className, "bg-[#F5F5F5] text-black")}
    >
      <body className="h-dvh w-dvw">
        <Analytics />
        <SpeedInsights />
        <Toaster />

        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
