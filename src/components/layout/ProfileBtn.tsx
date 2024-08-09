"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";
import { LogOut } from "react-feather";

export const ProfileBtn = () => {
  const { user, logout } = usePrivy();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative w-fit h-fit">
          {user?.email?.address}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="flex flex-col items-start">
          <div className="text-xs font-medium">{user?.email?.address}</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 focus:text-red-600 focus:bg-red-100 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
