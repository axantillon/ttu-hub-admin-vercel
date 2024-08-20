import Image from "next/image";
import { LogoutBtn } from "../utils/LogoutBtn";

export const EmailNotAuth = () => (
  <main className="relative h-dvh w-dvw flex flex-col items-center justify-center space-y-4">
    <div className="relative w-2/3 h-32 aspect-auto">
      <Image
        src="general/LogoSTL.svg"
        alt=""
        fill
        style={{
          objectFit: "contain",
        }}
      />
    </div>
    <span>Sorry, you must login in with an authorized email!</span>
    <LogoutBtn />
  </main>
);
