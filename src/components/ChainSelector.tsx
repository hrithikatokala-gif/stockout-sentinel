import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export interface Chain {
  id: string;
  name: string;
  location: string;
}

export const chains: Chain[] = [
  { id: "CH-001", name: "Downtown Main", location: "123 Main St" },
  { id: "CH-002", name: "Westside Plaza", location: "456 West Ave" },
  { id: "CH-003", name: "Harbor District", location: "789 Harbor Blvd" },
  { id: "CH-004", name: "Northgate Mall", location: "321 North Rd" },
];

interface ChainSelectorProps {
  selectedChain: string;
  onChainChange: (chainId: string) => void;
}

export const ChainSelector = ({ selectedChain, onChainChange }: ChainSelectorProps) => {
  const currentChain = chains.find(c => c.id === selectedChain);

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedChain} onValueChange={onChainChange}>
        <SelectTrigger className="w-[200px] h-9 text-sm">
          <SelectValue placeholder="Select chain" />
        </SelectTrigger>
        <SelectContent>
          {chains.map((chain) => (
            <SelectItem key={chain.id} value={chain.id}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{chain.name}</span>
                <span className="text-xs text-muted-foreground">{chain.id}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
