import DeleteEvent from "@/components/pages/events/DeleteEvent";
import { EditEventModal } from "@/components/pages/events/EditEventModal";
import { EventMessage } from "@/components/pages/events/EventMessage";
import SendEventMessage from "@/components/pages/events/sendEventMessage";
import ShareLink from "@/components/pages/events/ShareLink";
import AvatarCircles from "@/components/ui/AvatarCircles";
import { Badge } from "@/components/ui/shadcn/badge";
import { BackButton } from "@/components/utils/BackButton";
import { getEventById } from "@/db/event";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { Event, User } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface EventPageProps {
  params: { id: string };
}

const EventPage: FC<EventPageProps> = async ({ params }) => {
  const event: (Event & { users: User[] }) | null = await getEventById(
    params.id
  );

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="absolute top-0 -ml-6 pt-6 w-full z-50">
        <BackButton />
      </div>
      <div className="relative flex mt-4 py-4 px-6 bg-white rounded-xl gap-4">
        <div className="flex flex-col w-1/2 gap-2">
          <span className="text-2xl font-bold">{event.name}</span>

          <Badge
            className="w-fit"
            style={{
              backgroundColor: EVENT_CATEGORIES.find(
                (cat) => cat.name === event.category
              )?.color,
            }}
          >
            {event.category}
          </Badge>

          <div className="flex flex-row gap-2">
            <span className="text-sm text-gray-500">
              {formatInTimeZone(
                event.startTime,
                "America/New_York",
                "EEEE, MMMM d, yyyy"
              )}
            </span>
            <span className="text-sm text-gray-500">
              {formatInTimeZone(event.startTime, "America/New_York", "h:mm a")}
            </span>
          </div>

          <p>{event.description}</p>

          <div className="flex flex-col gap-2">
            <span className="-mb-2 text-sm text-gray-500">
              {event.users.length} Registered
            </span>
            <Link href={`/events/${event.id}/users`}>
              <div className="w-fit p-2 hover:bg-black/25 rounded-xl">
                {event.users && event.users.length !== 0 && (
                  <AvatarCircles
                    numPeople={event.users.length}
                    avatarUrls={event.users
                      .slice(0, 3)
                      .map((user) => user.profilePic || "users/default.jpg")}
                  />
                )}
              </div>
            </Link>
          </div>

          <div className="flex flex-row w-full justify-between mt-auto">
            <div className="flex items-center gap-2">
              <EditEventModal event={event} />
              <DeleteEvent eventId={event.id} />
            </div>
            <ShareLink text={`https://ttu-hub.vercel.app/event/${event.id}`} />
          </div>
        </div>

        <div className="flex flex-col w-1/2">
          <div className="relative w-full aspect-[330/176] bg-sky-400 rounded-xl overflow-clip">
            <Image
              src={event.coverImg || ""}
              fill
              alt=""
              className="aspect-auto object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-[390px] mx-auto py-4 gap-y-4">
        <SendEventMessage eventId={event.id} />
        {event.messages
          .slice()
          .reverse()
          .map((message, index) => (
            <EventMessage
              key={index}
              message={message}
              index={index}
              eventId={event.id}
            />
          ))}
      </div>
    </div>
  );
};

export default EventPage;
