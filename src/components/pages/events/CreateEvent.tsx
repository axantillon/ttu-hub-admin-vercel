"use client";

import { FC, useState } from "react";
import { z } from "zod";

// Import UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { toast } from "@/components/ui/shadcn/use-toast";

// Import custom components
import EventForm, { FormSchema } from "@/components/utils/EventForm";

// Import utility functions and constants
import { createEvent } from "@/db/event";
import { uploadEventsImage } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";

const CreateEvent: FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = usePrivy();
  const [sendAsEmail, setSendAsEmail] = useState(true);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    data.category = data.category === "unassigned" ? "" : data.category;

    let imgPath: string | null = null;
    try {
      if (data.coverImg) {
        imgPath = await uploadEventsImage(
          data.coverImg,
          data.name,
          data.category
        );
      }
      createEvent(
        { ...data, coverImg: imgPath! },
        sendAsEmail,
        user?.email?.address!
      )
        .then((e) => {
          toast({
            title: "New Event Created! 🎉",
            description: <span className="font-bold">{e.name}</span>,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error",
            description: "Failed to create event - " + error.message,
            variant: "destructive",
          });
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  const handleSuccessfulSubmit = () => {
    // This function will be called after a successful form submission
    // You can add any additional logic here if needed
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill out the details for your new event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-2xl">
          <EventForm
            onSubmit={onSubmit}
            loading={loading}
            submitButtonText={loading ? "Creating Event..." : "Create Event"}
            onSuccessfulSubmit={handleSuccessfulSubmit}
          />
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox
              id="sendAsEmail"
              checked={sendAsEmail}
              onCheckedChange={(checked) => setSendAsEmail(checked as boolean)}
            />
            <label
              htmlFor="sendAsEmail"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Send as email
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateEvent;