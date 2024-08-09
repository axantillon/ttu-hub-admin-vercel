import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/shadcn/card";
import LoginBtn from "@/components/utils/LoginBtn";
import Image from "next/image"  ;

const Login = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-orange-500">
      <Card className="w-full max-w-md p-6 bg-white backdrop-blur-sm shadow-xl rounded-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src="/general/TTULogo.png"
              alt="TTU Logo"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            TTU@CR HUB
          </CardTitle>
          <CardDescription className="text-gray-600">
            Admin Dashboard Login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginBtn />
          <p className="text-sm text-center text-gray-500">
            Please log in to access the admin dashboard.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
