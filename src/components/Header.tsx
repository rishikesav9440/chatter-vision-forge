
import { ModelSelector } from "./ModelSelector";
import { OpenRouterModel } from "@/types";

interface HeaderProps {
  selectedModel: OpenRouterModel;
  onSelectModel: (model: OpenRouterModel) => void;
}

export function Header({ selectedModel, onSelectModel }: HeaderProps) {
  return (
    <header className="border-b border-border py-3 px-4 flex items-center justify-between bg-background sticky top-0 z-10">
      <div className="font-semibold flex items-center gap-2 text-primary">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xl">AI</span>
        </div>
        <span>OpenRouter Chat</span>
      </div>
      
      <ModelSelector
        selectedModel={selectedModel}
        onSelectModel={onSelectModel}
      />
    </header>
  );
}
