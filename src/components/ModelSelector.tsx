
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OPENROUTER_MODELS, OpenRouterModel } from "@/lib/openrouter";
import { ChevronDown } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: OpenRouterModel;
  onSelectModel: (model: OpenRouterModel) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          {selectedModel.name}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {OPENROUTER_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onSelectModel(model)}
            className={`cursor-pointer ${selectedModel.id === model.id ? "bg-accent" : ""}`}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
