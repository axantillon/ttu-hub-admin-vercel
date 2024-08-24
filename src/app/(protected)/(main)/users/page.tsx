import UserItem, { DeleteUserButton } from "@/components/pages/users/UserItem";
import { Card } from "@/components/ui/shadcn/card";
import { getAllUsers } from "@/db/users";

export default async function Users() {
  const users = await getAllUsers();

  return (
    <div className="relative flex flex-col h-full gap-6 p-4 md:p-0">
      <span className="text-2xl md:text-3xl font-bold">Users</span>

      <div className="relative flex flex-col-reverse md:flex-row w-full h-full gap-4 overflow-auto">
        <div className="w-full md:w-2/3">
          <div className="flex flex-col w-full gap-2">
            {users.map((user) => {
              return (
                <UserItem
                  key={user.username}
                  user={user}
                  actionButton={<DeleteUserButton username={user.username} />}
                />
              );
            })}
          </div>
        </div>

        <div className="md:sticky md:top-0 md:w-1/3 mt-4 md:mt-0">
          <Card className="flex flex-col gap-4 p-4 w-full">
            <span className="text-xl">Stats & Filters</span>
            <span>
              Total Users <b>{users.length}</b>
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}
