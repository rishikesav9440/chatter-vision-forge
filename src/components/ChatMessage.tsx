
import { cn } from "@/lib/utils";
import { Message, MessageContent } from "@/types";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === "user";

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const renderContent = (content: MessageContent) => {
    if (content.type === "text") {
      return (
        <div className="markdown">
          <ReactMarkdown>{content.text}</ReactMarkdown>
        </div>
      );
    } else if (content.type === "image_url") {
      return (
        <div className="my-2">
          <img 
            src={content.image_url.url} 
            alt="Uploaded image" 
            className="max-h-60 rounded-md object-contain"
          />
          <div className="text-xs text-muted-foreground mt-1">Uploaded image</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      ref={messageRef}
      className={cn(
        "py-5 px-4 md:px-6", 
        isUser ? "bg-chat-user" : "bg-chat-assistant",
        isUser ? "border-l-4 border-l-primary" : ""
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className={cn(
          "text-sm font-medium mb-2",
          isUser ? "text-primary" : "text-foreground"
        )}>
          {isUser ? "You" : "Assistant"}
        </div>
        <div>
          {message.content.map((content, i) => (
            <div key={i}>{renderContent(content)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
