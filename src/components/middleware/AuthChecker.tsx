"use client";
import { isAllowedEmail } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next-nprogress-bar";
import { FC, ReactNode, useEffect } from "react";
import { EmailNotAuth } from "../views/EmailNotAuth";
import { SplashScreen } from "../views/SplashScreen";

const AuthChecker: FC<{ children: ReactNode }> = ({ children }) => {
  const { ready, authenticated, user: PrivyUser } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [authenticated, ready, router]);

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return <SplashScreen />;
  }

  if (ready && !authenticated) {
    return <SplashScreen />;
  }

  if (
    PrivyUser &&
    PrivyUser.email &&
    !isAllowedEmail(PrivyUser.email.address)
  ) {
    return <EmailNotAuth />;
  }

  return <>{authenticated && <>{children}</>}</>;
};

export default AuthChecker;
