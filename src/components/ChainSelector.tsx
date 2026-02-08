import { useState } from "react";
import { Building2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

/** Compact badge shown in the header */
export const ChainBadge = ({ chainId }: { chainId: string }) => {
  const chain = chains.find(c => c.id === chainId);
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-sm">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium">{chain?.name}</span>
      <span className="text-xs text-muted-foreground">({chainId})</span>
    </div>
  );
};

/** Full-page chain switching panel */
interface ChainSwitchPanelProps {
  selectedChain: string;
  onChainChange: (chainId: string) => void;
}

export const ChainSwitchPanel = ({ selectedChain, onChainChange }: ChainSwitchPanelProps) => {
  const [chainInput, setChainInput] = useState("");
  const [managerInput, setManagerInput] = useState("");
  const [error, setError] = useState("");
  const currentChain = chains.find(c => c.id === selectedChain);

  const handleAccess = () => {
    setError("");
    if (!chainInput.trim() || !managerInput.trim()) {
      setError("Both fields are required");
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
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{currentChain?.name}</p>
              <p className="text-sm text-muted-foreground">{currentChain?.location} · {selectedChain}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Switch Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chain ID</label>
            <Input
              placeholder="e.g. CH-002"
              value={chainInput}
              onChange={(e) => setChainInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Manager #</label>
            <Input
              placeholder="Enter manager identification"
              type="password"
              value={managerInput}
              onChange={(e) => setManagerInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAccess()}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleAccess} className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Access Location
          </Button>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-3">Available Locations</p>
            <div className="grid gap-2">
              {chains.map(c => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between rounded-md border p-3 text-sm ${
                    c.id === selectedChain ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div>
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-2 text-muted-foreground">{c.location}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{c.id}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
