"use client";

import { Button } from "@/components/ui/shadcn/button";
import { toast } from "@/components/ui/shadcn/use-toast";
import MarkdownInput from "@/components/utils/formInputs/MarkdownInput";
import { addEventMessage } from "@/db/event";
import { useCallback, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

const SendEventMessage = ({ eventId }: { eventId: string }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [markdownKey, setMarkdownKey] = useState(0);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    
    addEventMessage(eventId, content)
      .then((_) => {
        setContent("");
        toast({
          title: "Message Posted!",
          description: "Your message has been posted to the event. 🎉",
        });
        setIsLoading(false);
        setMarkdownKey((prevKey) => prevKey + 1);
      })
      .catch((err) => {
        setContent("");
        console.log(err);
        toast({
          title: "Error Posting Message",
          description:
            "There was an error posting your message. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [eventId, content]);

  return (
    <div className="flex flex-col">
      <MarkdownInput key={markdownKey} setContent={setContent} />
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-fit ml-auto mt-2"
      >
        {isLoading ? "Sending..." : "Send!"}
      </Button>
    </div>
  );
};

export default SendEventMessage;
