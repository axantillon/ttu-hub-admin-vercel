"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { Grid, List } from "react-feather";
import { EventItem } from "./EventItem";
import { useLocalStorage } from "usehooks-ts";

type EventWithUsers = Prisma.EventGetPayload<{
  include: { users: true };
}>;

export default function EventList({ events }: { events: EventWithUsers[] }) {
  const [isGridView, setIsGridView] = useLocalStorage("isGridView", false);

  const sortedEvents = events.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className={`relative flex-col md:flex-row w-full h-full py-2 md:-mt-4`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsGridView(!isGridView)}
        aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}
        className="z-10 relative -mt-6 mb-2"
      >
        {isGridView ? (
          <List className="h-4 w-4" />
        ) : (
          <Grid className="h-4 w-4" />
        )}
      </Button>
      <div
        className={`flex gap-4 md:px-4 md:pb-4 ${
          isGridView ? "flex-wrap" : "overflow-auto"
        }`}
      >
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <EventItem event={event} key={event.id} />
          ))
        ) : (
          <span className="text-gray-500 text-center">No events found</span>
        )}
      </div>
    </div>
  );
}
