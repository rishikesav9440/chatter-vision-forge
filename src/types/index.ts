
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: MessageContent[];
  createdAt: Date;
}

export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
  }
}

export type MessageContent = TextContent | ImageContent;

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
}

export interface OpenRouterRequestBody {
  model: string;
  messages: {
    role: "user" | "assistant" | "system";
    content: MessageContent[] | string;
  }[];
  stream?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: OpenRouterModel;
}
