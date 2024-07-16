import UsersList from "@/components/pages/users/UsersList";
import { Card } from "@/components/ui/shadcn/card";
import { getAllUsers } from "@/db/users";

export default async function Users() {
  const users = await getAllUsers();

  return (
    <div className="relative flex flex-col h-full gap-6">
      <span className="text-3xl font-bold">Users</span>

      <div className="relative flex w-full h-full gap-4 px-2 overflow-auto">
        <div className="w-2/3">
          <UsersList users={users} />
        </div>

        <div className="sticky top-0 left-0 w-1/3">
          <Card className="flex flex-col gap-4 p-4 w-full">
            <span className="text-xl">Stats & Filters</span>
            <span>Total Users <b>{users.length}</b></span>
          </Card>
        </div>
      </div>
    </div>
  );
}
