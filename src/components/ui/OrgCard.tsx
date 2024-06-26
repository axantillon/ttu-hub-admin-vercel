import { Org } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./shadcn/card";

function OrgCard({ org }: { org: Org }) {
  return (
    <Link href={`/org/${org.id}`}>
      <Card className="mt-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{org.name}</CardTitle>
            <Image src={"/TTULogo.png"} alt={org.name} width={75} height={75} />
            {/* TODO: Use the actual org picture when they are available */}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{org.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end">{"→"}</CardFooter>
      </Card>
    </Link>
  );
}

export default OrgCard;
