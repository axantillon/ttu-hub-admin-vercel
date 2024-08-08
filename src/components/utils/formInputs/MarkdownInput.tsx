"use client";

import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils/cn";
import { Bold, Italic, Underline } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MarkdownInputProps {
  setContent: (content: string) => void;
}

const MarkdownInput: React.FC<MarkdownInputProps> = ({ setContent }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      setIsEmpty(newContent === "" || newContent === "<br>");
    }
  }, [setContent]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();

        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 1024;
            const maxHeight = 768;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            const resizedImg = document.createElement('img');
            resizedImg.src = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed
            resizedImg.className = "inline-block w-[375px] max-h-[350px] object-contain mx-auto";

            insertNodeAtCursor(resizedImg);
            updateContent();
          };
          img.src = event.target?.result as string;
        };

        reader.readAsDataURL(blob as Blob);
      } else if (items[i].type === "text/plain") {
        items[i].getAsString((text) => {
          if (isValidUrl(text)) {
            const altText = prompt(
              "Enter alternative text for the link:",
              text
            );
            const link = document.createElement("a");
            link.href = text;
            link.textContent = altText || text;
            link.title = text;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "underline text-blue-600";
            insertNodeAtCursor(link);
          } else {
            insertNodeAtCursor(document.createTextNode(text));
          }
          updateContent();
        });
      }
    }
    setIsEmpty(false);
  };

  const handleInput = () => {
    updateContent();
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const insertNodeAtCursor = (node: Node) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
    }
  };

  const toggleStyle = useCallback((style: string) => {
    document.execCommand(style, false);
    updateStyleStates();
    updateContent();
  }, [updateContent]);

  const updateStyleStates = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            toggleStyle("bold");
            break;
          case "i":
            e.preventDefault();
            toggleStyle("italic");
            break;
          case "u":
            e.preventDefault();
            toggleStyle("underline");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleStyle]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-2 mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleStyle("bold")}
          className={cn(isBold && "bg-gray-200")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleStyle("italic")}
          className={cn(isItalic && "bg-gray-200")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleStyle("underline")}
          className={cn(isUnderline && "bg-gray-200")}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none">
            Send a message about this event...
          </div>
        )}
        <div
          id="markdown-input"
          ref={editorRef}
          contentEditable
          onPaste={handlePaste}
          onInput={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const br = document.createElement('br');
              insertNodeAtCursor(br);
              updateContent();
            }
          }}
          className="min-h-[200px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
    </div>
  );
};

export default MarkdownInput;
