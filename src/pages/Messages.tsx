import { useState } from "react";
import { Send, User, Search, Paperclip, MoreVertical } from "lucide-react";
import { suppliers } from "@/lib/supplier-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppHeader } from "@/components/AppHeader";

interface Message {
  id: string;
  from: "user" | "supplier";
  text: string;
  timestamp: string;
}

// Seed mock conversations
const mockConversations: Record<string, Message[]> = {
  "sup-001": [
    { id: "m1", from: "supplier", text: "Hi, confirming your chicken breast order for 80kg is on track for delivery tomorrow morning.", timestamp: "10:32 AM" },
    { id: "m2", from: "user", text: "Great, can you also add 40kg of Italian Sausage to that delivery?", timestamp: "10:45 AM" },
    { id: "m3", from: "supplier", text: "Absolutely. I'll update the invoice. Total will be $1,072. Delivery ETA 7:30 AM.", timestamp: "10:48 AM" },
  ],
  "sup-002": [
    { id: "m4", from: "supplier", text: "Heads up — shrimp prices are going up 8% next week due to supply shortages.", timestamp: "Yesterday" },
    { id: "m5", from: "user", text: "Thanks for the notice. Can we lock in current pricing for a bulk order?", timestamp: "Yesterday" },
    { id: "m6", from: "supplier", text: "I can hold current rates if you order 100kg+ by Friday.", timestamp: "Yesterday" },
  ],
  "sup-004": [
    { id: "m7", from: "user", text: "We need an urgent parmesan restock — can you expedite?", timestamp: "9:15 AM" },
    { id: "m8", from: "supplier", text: "Let me check warehouse availability. I'll get back to you within the hour.", timestamp: "9:20 AM" },
  ],
  "sup-006": [
    { id: "m9", from: "supplier", text: "Roma tomatoes are in peak season. Would you like to increase your standing order?", timestamp: "2 days ago" },
    { id: "m10", from: "user", text: "Yes, bump it up to 50kg for the next 3 weeks.", timestamp: "2 days ago" },
    { id: "m11", from: "supplier", text: "Done! You'll see the updated quantities starting next delivery.", timestamp: "2 days ago" },
  ],
};

export default function Messages() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>("sup-001");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(mockConversations);
  const [draft, setDraft] = useState("");

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSupplier = suppliers.find(s => s.id === selectedSupplier);
  const activeMessages = selectedSupplier ? (conversations[selectedSupplier] ?? []) : [];

  const handleSend = () => {
    if (!draft.trim() || !selectedSupplier) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      from: "user",
      text: draft.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversations(prev => ({
      ...prev,
      [selectedSupplier]: [...(prev[selectedSupplier] ?? []), newMsg],
    }));
    setDraft("");
  };

  const getLastMessage = (supplierId: string) => {
    const msgs = conversations[supplierId];
    if (!msgs?.length) return null;
    return msgs[msgs.length - 1];
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-lg border bg-card overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
          <div className="flex h-full">
            {/* Sidebar — supplier list */}
            <div className="w-80 border-r flex flex-col">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                {filteredSuppliers.map(supplier => {
                  const last = getLastMessage(supplier.id);
                  const isActive = selectedSupplier === supplier.id;
                  return (
                    <button
                      key={supplier.id}
                      onClick={() => setSelectedSupplier(supplier.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 border-b transition-colors",
                        isActive ? "bg-accent/50" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{supplier.name}</p>
                            {last && <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{last.timestamp}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {last ? last.text : supplier.contactName}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </ScrollArea>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {activeSupplier ? (
                <>
                  {/* Chat header */}
                  <div className="px-5 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{activeSupplier.name}</p>
                        <p className="text-xs text-muted-foreground">{activeSupplier.contactName} · {activeSupplier.phone}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 px-5 py-4">
                    <div className="space-y-3">
                      {activeMessages.map(msg => (
                        <div key={msg.id} className={cn("flex", msg.from === "user" ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[70%] rounded-xl px-3.5 py-2 text-sm",
                              msg.from === "user"
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted text-foreground rounded-bl-sm"
                            )}
                          >
                            <p>{msg.text}</p>
                            <p className={cn(
                              "text-[10px] mt-1",
                              msg.from === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                            )}>{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                      {activeMessages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-12">
                          No messages yet. Start a conversation with {activeSupplier.name}.
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="px-4 py-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                        className="h-9 text-sm"
                      />
                      <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSend} disabled={!draft.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Select a supplier to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
