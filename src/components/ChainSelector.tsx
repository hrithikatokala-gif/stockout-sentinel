import { useState } from "react";
import { Building2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [chainInput, setChainInput] = useState("");
  const [managerInput, setManagerInput] = useState("");
  const [error, setError] = useState("");
  const currentChain = chains.find(c => c.id === selectedChain);

  const handleAccess = () => {
    setError("");
    if (!chainInput.trim() || !managerInput.trim()) {
      setError("Both fields required");
      return;
    }
    const found = chains.find(c => c.id.toUpperCase() === chainInput.trim().toUpperCase());
    if (!found) {
      setError("Invalid Chain ID");
      return;
    }
    onChainChange(found.id);
    setChainInput("");
    setManagerInput("");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-sm">
        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{currentChain?.name}</span>
        <span className="text-xs text-muted-foreground">({selectedChain})</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Input
          placeholder="Chain ID"
          value={chainInput}
          onChange={(e) => setChainInput(e.target.value)}
          className="h-8 w-24 text-xs"
        />
        <Input
          placeholder="Manager #"
          value={managerInput}
          onChange={(e) => setManagerInput(e.target.value)}
          className="h-8 w-24 text-xs"
        />
        <Button size="sm" variant="outline" className="h-8 px-2.5" onClick={handleAccess}>
          <LogIn className="h-3.5 w-3.5" />
        </Button>
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
};
