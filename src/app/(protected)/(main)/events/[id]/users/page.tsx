import UserItem, { AttendEventButton } from "@/components/pages/users/UserItem";
import { BackButton } from "@/components/utils/BackButton";
import { getEventRewardAndUsersWithAttendance } from "@/db/event";

export default async function Event({ params }: { params: { id: string } }) {
  const { users, reward } = await getEventRewardAndUsersWithAttendance(
    params.id
  );
  
  return (
    <div className="flex flex-col w-full">
      <div className="z-50 relative -mt-[20px]">
        <BackButton />
      </div>
      <span className="text-lg font-medium mb-4">Signed Up</span>
      <div className="flex flex-col w-full gap-2">
        {users
          .sort((a, b) => a.firstName.localeCompare(b.firstName))
          .map((user, index) => {
            return (
              <UserItem
                key={index}
                user={user}
                hideBadges={true}
                actionButton={
                  <AttendEventButton
                    username={user.username}
                    attended={user.attended}
                    eventId={params.id}
                    reward={reward}
                  />
                }
              />
            );
          })}
      </div>
    </div>
  );
}
