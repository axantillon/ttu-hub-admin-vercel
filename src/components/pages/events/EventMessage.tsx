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
import { useToast } from "@/components/ui/shadcn/use-toast";
import { removeEventMessage } from "@/db/event";
import { useState } from "react";
import { Loader, Trash2 } from "react-feather";

export function EventMessage({
  eventId,
  message,
  index,
}: {
  eventId: string;
  message: string;
  index: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const handleDelete = () => {
    setIsDeleting(true);
    removeEventMessage(eventId, index)
      .then(() => {
        setIsDeleting(false);
      })
      .catch(() => {
        setIsDeleting(false);
        toast({
          variant: "destructive",
          title: "Failed to delete message",
          description:
            "An error occurred while deleting the message. Try again.",
        });
      });
  };

  return (
    <div className="relative flex flex-col w-full rounded-xl shadow-sm shadow-gray-300 bg-white text-gray-500 px-4 sm:px-6 py-4">
      <div dangerouslySetInnerHTML={{ __html: message }} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="absolute top-1 right-1 sm:-right-10 flex items-center justify-center size-8 rounded-lg bg-red-500 hover:bg-red-700 text-white cursor-pointer">
            {isDeleting ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">
              Are you sure you want to delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              This action cannot be undone. This will permanently delete it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-500 hover:bg-red-800"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}