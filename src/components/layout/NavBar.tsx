"use client";
import { NavPath } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";
import { Box, Calendar, Grid, Users } from "react-feather";

interface NavBarProps {}
const NavBar: FC<NavBarProps> = ({}) => {
  const activePath = usePathname();

  return (
    <div className={cn("flex flex-col w-48 h-dvh py-8 px-4 bg-white gap-2")}>
      <div className="relative w-full h-16 aspect-auto mb-4">
        <Image
          src="/TTULogoBig.png"
          className="self-center"
          fill
          style={{
            objectFit: "contain",
          }}
          alt=""
        />
      </div>
      <NavIcon pathname={NavPath.DASHBOARD} activePath={activePath}>
        <Box />
        <span> Dashboard </span>
      </NavIcon>

      <NavIcon pathname={NavPath.EVENTS} activePath={activePath}>
        <Calendar />
        <span> Events </span>
      </NavIcon>

      <NavIcon pathname={NavPath.ORGS} activePath={activePath}>
        <Grid />
        <span> Student Orgs</span>
      </NavIcon>

      <NavIcon pathname={NavPath.USERS} activePath={activePath}>
        <Users />
        <span>Users</span>
      </NavIcon>
    </div>
  );
};

const NavIcon: FC<{
  children: ReactNode;
  pathname: NavPath;
  activePath: string;
}> = ({ children, pathname, activePath }) => {
  return (
    <Link href={pathname}>
      <div
        className={cn(
          //TODO Find regex that matches for root
          activePath == pathname && "bg-stone-400/20",
          "flex w-full h-10 px-2 py-1 items-center cursor-pointer gap-2 rounded-lg text-sm hover:bg-stone-400/10"
        )}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavBar;
