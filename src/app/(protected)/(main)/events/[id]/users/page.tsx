import UsersList from "@/components/pages/users/UsersList";
import { BackButton } from "@/components/utils/BackButton";
import { getEventUsers } from "@/db/event";

export default async function Event({ params }: { params: { id: string } }) {
  const users = await getEventUsers(params.id);

  return (
    <div className="flex flex-col w-full">
      <div className="absolute top-0 -ml-6 pt-6 w-full z-50">
        <BackButton />
      </div>
      <span className="text-lg font-medium mt-[18px] mb-4">Registered</span>
      <UsersList users={users} />
    </div>
  );
}
