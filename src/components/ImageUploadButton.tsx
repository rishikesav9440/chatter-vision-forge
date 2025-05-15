
import { Button } from "@/components/ui/button";
import { MessageContent } from "@/types";
import { uploadImageToImageKit } from "@/lib/imagekit";
import { toast } from "sonner";
import { ChangeEvent, useRef } from "react";
import { Image } from "lucide-react";

interface ImageUploadButtonProps {
  onImageUpload: (imageContent: MessageContent) => void;
  disabled?: boolean;
}

export function ImageUploadButton({ onImageUpload, disabled = false }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      toast.loading("Uploading image...");
      
      // Upload to ImageKit
      const imageUrl = await uploadImageToImageKit(file);
      
      if (imageUrl) {
        toast.dismiss();
        toast.success("Image uploaded successfully");
        
        // Pass image URL as text content rather than base64 data
        onImageUpload({
          type: "text",
          text: `[Image: ${imageUrl}]`
        });
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }

    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleButtonClick}
        disabled={disabled}
        title="Upload an image"
      >
        <Image className="h-5 w-5" />
      </Button>
    </>
  );
}
