import { Message, MessageContent, OpenRouterModel, OpenRouterRequestBody } from "@/types";
import { toast } from "sonner";

// Most popular models
export const OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: "anthropic/claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet"
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o"
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus"
  },
  {
    id: "anthropic/claude-3-sonnet",
    name: "Claude 3 Sonnet"
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku"
  },
  {
    id: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro"
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large"
  }
];

export const DEFAULT_MODEL = OPENROUTER_MODELS[0];

const OPENROUTER_API_KEY = ""; // Replace with your API key

export async function sendMessageToOpenRouter(
  messages: Message[],
  model: OpenRouterModel
): Promise<Message> {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key is missing");
    }

    // Map our internal messages to OpenRouter format
    const formattedMessages = messages.map((message) => ({
      role: message.role,
      content: message.content
    }));

    // Add system message if needed
    const systemMessage: {
      role: "system";
      content: string;
    } = {
      role: "system",
      content: "You are a helpful assistant that can also analyze images."
    };

    const requestBody: OpenRouterRequestBody = {
      model: model.id,
      messages: [systemMessage, ...formattedMessages]
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "OpenRouter Chat App"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response");
    }

    const data = await response.json();
    const responseMessage = data.choices[0].message;

    // Create a properly formatted message
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: [
        {
          type: "text",
          text: responseMessage.content
        }
      ],
      createdAt: new Date()
    };

    return newMessage;
  } catch (error) {
    console.error("Error sending message to OpenRouter:", error);
    toast.error(error instanceof Error ? error.message : "Failed to communicate with AI");
    throw error;
  }
}

export function formatImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    reader.onerror = reject;
  });
}
