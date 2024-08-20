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
    <div className={`relative flex-col md:flex-row w-full h-full mt-2 gap-y-4`}>
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsGridView(!isGridView)}
          aria-label={isGridView ? "Switch to list view" : "Switch to grid view"}
        >
          {isGridView ? (
            <List className="h-4 w-4" />
          ) : (
            <Grid className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={`flex gap-4 pl-1 pr-2 pb-2 md:pb-4 ${
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
