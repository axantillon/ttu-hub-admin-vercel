"use client";
import { NavPath } from "@/lib/types";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "../ui/shadcn/button";
import { Spinner } from "./Spinner";

interface LoginBtnProps {}

const LoginBtn: FC<LoginBtnProps> = ({}) => {
  const { ready, authenticated } = usePrivy();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { login } = useLogin({
    onComplete: () => {
      setLoading(true);

      router.push(NavPath.DASHBOARD);
    },

    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Button className="w-20" disabled={!ready || authenticated} onClick={login}>
      {ready && !loading ? "Login" : <Spinner />}
    </Button>
  );
};

export default LoginBtn;
