"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { toast } from "@/components/ui/shadcn/use-toast";
import MarkdownInput from "@/components/utils/formInputs/MarkdownInput";
import { addEventMessage } from "@/db/event";
import { useCallback, useState } from "react";

const SendEventMessage = ({ eventId }: { eventId: string }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [markdownKey, setMarkdownKey] = useState(0);
  const [sendAsEmail, setSendAsEmail] = useState(true);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);

    addEventMessage(eventId, content, sendAsEmail)
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
        toast({
          title: "Error with message",
          description: err.message,
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [eventId, content, sendAsEmail]);

  return (
    <div className="flex flex-col">
      <MarkdownInput key={markdownKey} setContent={setContent} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="sendAsEmail"
            checked={sendAsEmail}
            onCheckedChange={(checked) => setSendAsEmail(checked as boolean)}
          />
          <span>Send as email</span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || content === ""}
          className="w-fit ml-auto mt-2"
        >
          {isLoading ? "Sending..." : "Send!"}
        </Button>
      </div>
    </div>
  );
};

export default SendEventMessage;
