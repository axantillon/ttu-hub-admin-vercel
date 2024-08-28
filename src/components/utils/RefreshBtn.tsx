"use client";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next-nprogress-bar";
import { useTransition } from "react";
import { RefreshCw } from "react-feather";

export const RefreshBtn = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div
      onClick={handleRefresh}
      className={cn(
        "flex items-center justify-center size-12 sm:size-8 bg-white rounded-full cursor-pointer"
      )}
    >
      {isPending ? (
        <div className="size-6 sm:size-4 animate-spin text-gray-500">
          <svg
            fill="#000000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
          </svg>
        </div>
      ) : (
        <RefreshCw className="size-6 sm:size-4 text-gray-500" />
      )}
    </div>
  );
};
