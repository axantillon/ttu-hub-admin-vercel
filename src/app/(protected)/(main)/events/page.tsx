import CreateEvent from "@/components/pages/events/CreateEvent";
import EventList from "@/components/pages/events/EventList";
import { Button } from "@/components/ui/shadcn/button";
import { getAllEvents } from "@/db/event";
import Link from "next/link";

export default async function Events() {
  const events = await getAllEvents();

  return (
    <div className="relative flex flex-col mt-0 md:mt-10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl md:text-3xl font-bold">Events @ TTUCR</span>
        <Link prefetch={true} href={"/events/past"}>
          <Button>Past Events</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-y-2 mb-4">
        <span className="-mb-12 text-xl font-bold text-black/50">
          Upcoming Events
        </span>

        <EventList events={events} />
      </div>

      <CreateEvent />
    </div>
  );
}