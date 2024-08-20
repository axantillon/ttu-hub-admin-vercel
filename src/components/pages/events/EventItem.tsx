import AvatarCircles from "@/components/ui/AvatarCircles";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { Event, User } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface EventItemProps {
  event: {
    users: User[];
  } & Event;
}

export const EventItem: FC<EventItemProps> = ({ event }) => {
  return (
    <Link prefetch={true} href={`/events/${event.id}`}>
      <div className="flex flex-col gap-y-1 w-[330px] h-[290px] rounded-2xl shadow-sm shadow-gray-300 bg-white ">
        <div className="relative flex items-end justify-between w-full h-44 p-3 rounded-2xl shadow-md shadow-gray-400 overflow-clip">
          <Image
            src={event.coverImg || ""}
            fill
            alt=""
            className="absolute top-0 left-0 aspect-auto object-cover bg-sky-400"
          />
          <Badge
            className="z-10"
            style={{
              backgroundColor: EVENT_CATEGORIES.find(
                (cat) => cat.name === event.category
              )?.color,
            }}
          >
            {event.category}
          </Badge>
          {event.users && event.users.length !== 0 && (
            <AvatarCircles
              className="-space-x-6 *:bg-white *:text-black *:shadow-lg "
              numPeople={event.users.length}
              avatarUrls={event.users
                .slice(0, 3)
                .map((user) => user.profilePic || "users/default.jpg")}
            />
          )}
        </div>

        <div className="flex flex-1 flex-row items-center w-full">
          <div className="flex flex-col items-center justify-center w-1/3 h-full gap-y-2">
            <span className="text-xs text-center font-normal -mb-2">
              {formatInTimeZone(event.startTime, "America/Costa_Rica", "EEEE")}
            </span>
            <span className="text-2xl text-center font-normal">
              {formatInTimeZone(
                event.startTime,
                "America/Costa_Rica",
                "MMM dd"
              )}
            </span>

            <div className="flex justify-center items-center px-2 py-1 rounded-2xl bg-gray-300">
              <span className="text-xs leading-none text-center font-normal">
                {formatInTimeZone(
                  event.startTime,
                  "America/Costa_Rica",
                  "K:mm aa"
                )}
              </span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-20" />

          <div className="flex flex-col items-left justify-evenly w-2/3 h-full px-3 py-1">
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

              <span className="pl-0.5 text-xs font-bold text-gray-500 line-clamp-1">
                {event.location}
              </span>
            </div>

            <span className="text-lg font-bold leading-tight line-clamp-2">
              {event.name}
            </span>

            <p className="text-xs font-medium text-slate-800 line-clamp-2 mb-1">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
