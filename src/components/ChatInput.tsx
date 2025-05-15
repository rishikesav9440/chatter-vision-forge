
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageContent } from "@/types";
import { ImageUploadButton } from "./ImageUploadButton";
import { Send } from "lucide-react";
import { useState, useRef, FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (content: MessageContent[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [uploadedImages, setUploadedImages] = useState<MessageContent[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    
    if (inputValue.trim() === "" && uploadedImages.length === 0) return;
    
    const content: MessageContent[] = [
      ...uploadedImages
    ];
    
    if (inputValue.trim() !== "") {
      content.push({
        type: "text",
        text: inputValue
      });
    }
    
    onSendMessage(content);
    setInputValue("");
    setUploadedImages([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (imageContent: MessageContent) => {
    setUploadedImages((prev) => [...prev, imageContent]);
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {uploadedImages.map((image, index) => (
              image.type === "image_url" && (
                <div key={index} className="relative">
                  <img
                    src={image.image_url.url}
                    alt={`Uploaded image ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md border border-border"
                  />
                  <button
                    onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="resize-none pr-12 min-h-[80px] max-h-[300px]"
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2">
              <ImageUploadButton 
                onImageUpload={handleImageUpload} 
                disabled={isLoading} 
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || (inputValue.trim() === "" && uploadedImages.length === 0)}
          >
            <Send size={18} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Messages are processed through OpenRouter and may be subject to their policies
        </div>
      </div>
    </div>
  );
}
