import AvatarCircles from "@/components/ui/AvatarCircles";
import { Separator } from "@/components/ui/shadcn/separator";
import { Event, User } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { FC } from "react";

interface EventItemProps {
  event: {
    users: User[];
  } & Event;
}

export const EventItem: FC<EventItemProps> = ({ event }) => {
  return (
    <Link prefetch={true} href={`/event/${event.id}`}>
      <div className="flex flex-col gap-y-2 w-80 h-72 rounded-2xl shadow-sm shadow-gray-300 bg-white ">
        <div
          className="relative w-full h-44 rounded-2xl shadow-md shadow-gray-400 bg-sky-500"
          style={{
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(https://yyccawyordfhdjblwusu.supabase.co/storage/v1/object/public/${event.coverImg})`,
          }}
        >
          <div className="absolute inset-x-0 bottom-0 flex justify-end items-end h-16">
            {event.users && event.users.length !== 0 && (
              <AvatarCircles
                className=" m-3 -space-x-6 *:bg-white *:text-black *:shadow-lg "
                numPeople={event.users.length}
                avatarUrls={event.users
                  .slice(0, 3)
                  .map((user) => user.profilePic || "")}
              />
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-row items-center w-full">
          <div className="flex flex-col items-center justify-center w-1/3 h-full gap-y-2">
            <h1 className="text-2xl text-center font-normal">
              {format(event.startTime, "MMM dd")}
            </h1>

            <div className="flex justify-center items-center px-2 py-1 rounded-2xl bg-gray-300">
              <span className="text-xs leading-none text-center font-normal">
                {format(event.startTime, "K:mm aa")}
              </span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-20" />

          <div className="flex flex-col items-left justify-center w-2/3 h-24 px-3 py-1 gap-y-2">
            <div className="flex flex-row test-xs font-bold text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="grey"
                className="size-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>

              <h2 className="pl-0.5 text-xs font-bold text-gray-500 -mb-0.5">
                {event.location}
              </h2>
            </div>

            <h1 className="text-xl font-bold leading-tight line-clamp-2">
              {event.name}
            </h1>

            <p className="text-xs font-medium text-slate-800 leading-tight line-clamp-2 pb-0.5">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
