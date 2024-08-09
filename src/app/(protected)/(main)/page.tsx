"use client";

import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { NavPath } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push(NavPath.EVENTS);
  return (
    <div className="flex flex-col w-full h-full pt-12 px-8 space-y-8">
      <Skeleton className="w-full h-full bg-black/5" />
    </div>
  );
}
