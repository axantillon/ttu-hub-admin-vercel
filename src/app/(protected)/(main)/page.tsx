"use client";

import { NavPath } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push(NavPath.EVENTS);
  return <div className="flex flex-col pt-12 px-8 space-y-8"></div>;
}
