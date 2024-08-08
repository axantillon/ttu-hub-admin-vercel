"use client";

import { Button } from "@/components/ui/shadcn/button";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { useState } from "react";
import { Send } from "react-feather";

const ShareLink = ({text}: {text: string}) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Unable to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      className="flex items-center gap-x-2 bg-blue-500 hover:bg-blue-600 text-white"
    >
      <Send size={16} />
      {isCopied ? "Copied!" : "Copy Link"}
    </Button>
  );
};

export default ShareLink;
