"use client";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  const displayNum = (numPeople || 0) - avatarUrls.length;

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <div
          key={index}
          className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-300 bg-white"
        >
          <Image
            className="object-cover"
            src={url || "/general/default.jpg"}
            fill
            sizes="40px"
            alt={`Avatar ${index + 1}`}
          />
        </div>
      ))}
      {displayNum > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white dark:border-gray-800 dark:bg-white dark:text-black">
          +{displayNum}
        </div>
      )}
    </div>
  );
};

export default AvatarCircles;