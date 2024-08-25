"use client";

import { Button } from "@/components/ui/shadcn/button";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { toggleEventClosed } from "@/db/event";
import { useState } from "react";

interface CloseEventProps {
  eventId: string;
  initialClosedState: boolean;
}

const CloseEvent: React.FC<CloseEventProps> = ({
  eventId,
  initialClosedState,
}) => {
  const [isClosed, setIsClosed] = useState(initialClosedState);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleClose = async () => {
    const previousState = isClosed;
    setIsClosed(!isClosed); // Optimistically update UI
    setIsLoading(true);

    try {
      await toggleEventClosed(eventId);
      toast({
        title: isClosed ? "Event reopened" : "Event closed",
        description: "The event status has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to toggle event status:", error);
      setIsClosed(previousState); // Revert to previous state on error
      toast({
        title: "Error",
        description: "Failed to update event status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleClose}
      disabled={isLoading}
      variant={isClosed ? "outline" : "default"}
      className="w-auto"
    >
      {isLoading ? "Processing..." : isClosed ? "Reopen Event" : "Close Event"}
    </Button>
  );
};

export default CloseEvent;
