"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { toast } from "@/components/ui/shadcn/use-toast";
import { updateEvent } from "@/db/event";
import { uploadEventsImage } from "@/lib/utils";
import { Event } from "@prisma/client";
import { FC, useState } from "react";
import { z } from "zod";
import EventForm, { FormSchema } from "@/components/utils/EventForm";

interface EditEventModalProps {
  event: Event;
}

export const EditEventModal: FC<EditEventModalProps> = ({ event }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    data.category = data.category === "unassigned" ? "" : data.category;

    let imgPath = event.coverImg;
    if (data.coverImg) {
      try {
        imgPath = await uploadEventsImage(
          data.coverImg,
          data.name,
          data.category
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    updateEvent(event.id, { ...data, coverImg: imgPath! })
      .then(() => {
        toast({
          title: "Event Updated!",
          description: <span className="font-bold">{data.name} 🎉</span>,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  }

  const handleSuccessfulSubmit = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">Edit Event</Button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[95dvw] sm:max-w-[600px] h-[90dvh] sm:h-[calc(100dvh-6rem)] p-4 sm:p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit the event details and save changes.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[calc(90vh-12rem)] sm:h-[calc(100vh-16rem)] overflow-y-auto px-2">
          <EventForm
            defaultValues={{
              name: event.name,
              description: event.description,
              startTime: event.startTime,
              location: event.location,
              organizer: event.organizer,
              category: event.category || "",
            }}
            onSubmit={onSubmit}
            loading={loading}
            submitButtonText={loading ? "Saving..." : "Save Changes"}
            onSuccessfulSubmit={handleSuccessfulSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
