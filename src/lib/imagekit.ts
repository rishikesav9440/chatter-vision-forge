
import ImageKit from "imagekit";
import { toast } from "sonner";

// Initialize ImageKit with your credentials
// These should be stored in environment variables in production
const imagekit = new ImageKit({
  publicKey: "your_public_key", // Replace with your public key
  privateKey: "your_private_key", // Replace with your private key
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id" // Replace with your URL endpoint
});

export async function uploadImageToImageKit(file: File): Promise<string | null> {
  try {
    // Convert file to base64 for upload
    const base64 = await fileToBase64(file);
    if (!base64) return null;
    
    // Get only the base64 data without the prefix
    const base64Data = base64.split(',')[1];
    
    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: base64Data,
      fileName: file.name,
      useUniqueFileName: true
    });
    
    // Return the URL of the uploaded image
    return response.url;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    toast.error("Failed to upload image");
    return null;
  }
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = reject;
  });
}
