"use client";
import { NavPath } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Calendar, Menu, Users } from "react-feather";

interface NavBarProps {}
const NavBar: FC<NavBarProps> = ({}) => {
  const activePath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this effect to close the menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [activePath]);

  return (
    <>
      <button
        className="md:hidden fixed top-6 left-4 z-30 flex items-center justify-center w-[38px] h-[38px] bg-white border border-stone-200 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>
      <div
        ref={navRef}
        className={cn(
          "z-20 fixed md:relative flex flex-col w-64 md:w-48 h-dvh py-8 px-4 bg-white gap-2 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Link
          href={NavPath.DASHBOARD}
          className="relative w-full h-16 aspect-auto mb-4"
        >
          <Image
            src="general/TTULogoBig.png"
            className="self-center"
            fill
            style={{
              objectFit: "contain",
            }}
            alt="TTU Logo"
          />
        </Link>
        <NavIcon pathname={NavPath.EVENTS} activePath={activePath}>
          <Calendar />
          <span> Events </span>
        </NavIcon>
        <NavIcon pathname={NavPath.USERS} activePath={activePath}>
          <Users />
          <span>Users</span>
        </NavIcon>
      </div>
    </>
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