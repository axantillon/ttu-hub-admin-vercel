"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";
import { Button } from "@/components/ui/shadcn/button";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { deleteEvent } from "@/db/event";
import { useRouter } from "next-nprogress-bar";
import { FC, useState } from "react";
import { Loader, Trash2 } from "react-feather";

interface DeleteEventProps {
  eventId: string;
}

const DeleteEvent: FC<DeleteEventProps> = ({ eventId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      toast({
        title: "Event Deleted",
        description: `Event has been successfully deleted.`,
      });
      router.back();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete event",
        description:
          "An error occurred while deleting the event. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit">
          {isDeleting ? (
            <Loader size={16} className="animate-spin mr-2" />
          ) : (
            <Trash2 size={16} className="mr-2" />
          )}
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this event?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEvent;
