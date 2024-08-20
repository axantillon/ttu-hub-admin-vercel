"use client";

import { NavPath } from "@/lib/types";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { Loader } from "react-feather";
import { Button } from "../ui/shadcn/button";

const LoginBtn = () => {
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
    <div className="flex justify-center items-center">
      <Button
        className="w-40 h-12 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
        disabled={!ready || authenticated}
        onClick={login}
      >
        {ready && !loading ? (
          "Login"
        ) : (
          <Loader className="w-6 h-6 text-white animate-spin" />
        )}
      </Button>
    </div>
  );
};

export default LoginBtn;
