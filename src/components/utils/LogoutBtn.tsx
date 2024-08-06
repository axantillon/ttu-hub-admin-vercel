"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "../ui/shadcn/button";

export const LogoutBtn = () => {
  const { logout } = usePrivy();

  return (
    <Button
      onClick={() => {
        logout();
      }}
    >
      Log out
    </Button>
  );
};
