import CreateEvent from "@/components/pages/events/CreateEvent";
import EventList from "@/components/pages/events/EventList";
import { Button } from "@/components/ui/shadcn/button";
import { getAllEvents } from "@/db/event";
import Link from "next/link";

export default async function Events() {
  const events = await getAllEvents();

  return (
    <div className="relative flex flex-col gap-6">
      <span className="text-3xl font-bold">Events @ TTUCR</span>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-black/50">
            Upcoming Events
          </span>
          <Link prefetch={true} href={"/events/past"}>
            <Button>Past Events</Button>
          </Link>
        </div>

        <EventList events={events} />
      </div>

      <CreateEvent />
    </div>
  );
}
