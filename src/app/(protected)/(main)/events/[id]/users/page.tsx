import UserItem from "@/components/pages/users/UserItem";
import { BackButton } from "@/components/utils/BackButton";
import { getEventUsers } from "@/db/event";

export default async function Event({ params }: { params: { id: string } }) {
  const users = await getEventUsers(params.id);

  return (
    <div className="flex flex-col w-full">
      <div className="z-50 relative -mt-[20px]">
        <BackButton />
      </div>
      <span className="text-lg font-medium mb-4">Registered</span>
      <div className="flex flex-col w-full gap-2">
        {users.map((user) => {
          return <UserItem key={user.id} user={user} />;
        })}
      </div>
    </div>
  );
}
