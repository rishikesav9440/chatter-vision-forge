
import { useState, useEffect, useRef } from "react";
import { Message, OpenRouterModel, MessageContent } from "@/types";
import { DEFAULT_MODEL, sendMessageToOpenRouter, saveApiKey } from "@/lib/openrouter";
import { Header } from "@/components/Header";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel>(DEFAULT_MODEL);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyForm, setShowApiKeyForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for previously stored API key
  useEffect(() => {
    const storedApiKey = localStorage.getItem("OPENROUTER_API_KEY");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowApiKeyForm(false);
      // Add welcome message
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: [{
            type: "text",
            text: "Hello! I'm your AI assistant powered by OpenRouter. I can help answer questions and analyze images. How may I assist you today?"
          }],
          createdAt: new Date()
        }
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: MessageContent[]) => {
    if (content.length === 0) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content,
      createdAt: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessageToOpenRouter(
        [...messages, newMessage], 
        selectedModel
      );
      
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Error is already shown via toast in the sendMessageToOpenRouter function
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectModel = (model: OpenRouterModel) => {
    setSelectedModel(model);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenRouter API key");
      return;
    }
    
    // Save API key
    saveApiKey(apiKey);
    setShowApiKeyForm(false);
    
    // Add welcome message
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: [{
          type: "text",
          text: "Hello! I'm your AI assistant powered by OpenRouter. I can help answer questions and analyze images. How may I assist you today?"
        }],
        createdAt: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
      />
      
      <main className="flex-1 overflow-y-auto">
        {showApiKeyForm ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-sm border border-border">
              <div>
                <h1 className="text-2xl font-bold text-center">Welcome to OpenRouter Chat</h1>
                <p className="text-center text-muted-foreground mt-2">
                  To get started, please enter your OpenRouter API key
                </p>
              </div>
              
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                    OpenRouter API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="sk-or-..."
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-primary underline">openrouter.ai/keys</a>
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Start Chatting
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md space-y-4">
                  <h2 className="text-2xl font-bold">Start a conversation</h2>
                  <p className="text-muted-foreground">
                    Send a message to start chatting with the AI assistant. You can also upload images for analysis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-chat-border">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="py-5 px-4 md:px-6 bg-chat-assistant">
                    <div className="max-w-3xl mx-auto">
                      <div className="text-sm font-medium mb-2 text-foreground">
                        Assistant
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </main>
      
      {!showApiKeyForm && (
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Index;
