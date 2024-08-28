import UserItem, { AttendEventButton } from "@/components/pages/users/UserItem";
import { BackButton } from "@/components/utils/BackButton";
import { RefreshBtn } from "@/components/utils/RefreshBtn";
import { getEventRewardAndUsersWithAttendance } from "@/db/event";

export default async function Event({ params }: { params: { id: string } }) {
  const { users, reward } = await getEventRewardAndUsersWithAttendance(
    params.id
  );

  const attendedUsers = users.filter((user) => user.attended);

  return (
    <div className="flex flex-col w-full">
      <div className="z-50 relative -mt-[20px]">
        <BackButton />
      </div>
      <div className="flex items-end sm:items-center justify-between sm:justify-start gap-4 mb-4 ">
        <span className="text-lg font-medium">
          Signed Up{" "}
          <span className="text-gray-500 text-base">
            {attendedUsers.length} / {users.length}
          </span>
        </span>
        <RefreshBtn />
      </div>
      <div className="flex flex-col w-full gap-2">
        {users
          .sort((a, b) => {
            // Compare first letters of firstName
            const firstLetterComparison = a.firstName[0].localeCompare(
              b.firstName[0]
            );

            // If first letters are the same, sort by signUpDate
            if (firstLetterComparison === 0) {
              return (
                new Date(b.signUpDate).getTime() -
                new Date(a.signUpDate).getTime()
              );
            }

            return firstLetterComparison;
          })
          .map((user) => {
            return (
              <UserItem
                key={user.username}
                user={user}
                hideBadges={true}
                signUpDate={user.signUpDate}
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
