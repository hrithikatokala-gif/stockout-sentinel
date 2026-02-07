import { useState } from "react";
import { Mail, Plus, X, Search, Building2, User, Truck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EmailProvider = "gmail" | "outlook" | "manual" | null;

interface FilteredEmail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  category: "supplier" | "delivery" | "pricing" | "urgent";
}

const mockEmails: FilteredEmail[] = [
  {
    id: "1",
    from: "orders@syscofoodservice.com",
    subject: "Order Confirmation #45892 - Delivery Tomorrow",
    snippet: "Your order of 50 lbs chicken breast and 20 lbs italian sausage is confirmed for delivery...",
    date: "2 hours ago",
    category: "delivery",
  },
  {
    id: "2",
    from: "pricing@usfoods.com",
    subject: "Price Update Alert: Olive Oil +8%",
    snippet: "We're notifying you of upcoming price changes effective next week. Extra virgin olive oil...",
    date: "5 hours ago",
    category: "pricing",
  },
  {
    id: "3",
    from: "support@gordonfs.com",
    subject: "⚠️ Stock Alert: Mozzarella Shortage",
    snippet: "Due to supply chain issues, mozzarella cheese availability is limited. Please adjust orders...",
    date: "1 day ago",
    category: "urgent",
  },
  {
    id: "4",
    from: "accounts@performancefoodgroup.com",
    subject: "Invoice #INV-2024-1892",
    snippet: "Attached is your invoice for the week ending January 15th. Total amount: $4,892.50...",
    date: "2 days ago",
    category: "supplier",
  },
];

const categoryConfig = {
  supplier: { label: "Supplier", icon: Building2, color: "bg-blue-500/10 text-blue-600" },
  delivery: { label: "Delivery", icon: Truck, color: "bg-green-500/10 text-green-600" },
  pricing: { label: "Pricing", icon: User, color: "bg-amber-500/10 text-amber-600" },
  urgent: { label: "Urgent", icon: AlertTriangle, color: "bg-red-500/10 text-red-600" },
};

export const EmailIntegration = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState<EmailProvider>(null);
  const [filterKeywords, setFilterKeywords] = useState<string[]>(["sysco", "usfoods", "gordon", "performance food"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleConnect = (provider: EmailProvider) => {
    // In production, this would trigger OAuth flow
    setConnectedProvider(provider);
  };

  const handleDisconnect = () => {
    setConnectedProvider(null);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !filterKeywords.includes(newKeyword.toLowerCase())) {
      setFilterKeywords([...filterKeywords, newKeyword.toLowerCase()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFilterKeywords(filterKeywords.filter(k => k !== keyword));
  };

  const filteredEmails = mockEmails.filter(email =>
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex w-full items-center gap-3 rounded-lg border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm"
      >
        <div className="rounded-lg bg-primary/10 p-2">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Email Integration</h3>
          <p className="text-xs text-muted-foreground">
            {connectedProvider 
              ? `Connected to ${connectedProvider === "gmail" ? "Gmail" : connectedProvider === "outlook" ? "Outlook" : "Manual Input"}`
              : "Connect your email to filter supplier communications"
            }
          </p>
        </div>
        <Plus className="h-4 w-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Email Integration</h3>
            <p className="text-xs text-muted-foreground">Filter inventory-related emails</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {!connectedProvider ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose how to connect your email:</p>
            
            <button
              onClick={() => handleConnect("gmail")}
              className="flex w-full items-center gap-3 rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-muted/50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.27 5.27L12 10.9l6.73-5.63A2 2 0 0 0 17.32 4H6.68a2 2 0 0 0-1.41.59v.68z" />
                <path fill="#4285F4" d="M20 7.7l-8 6.3-8-6.3V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7.7z" />
                <path fill="#FBBC05" d="M4 7.7V17a3 3 0 0 0 .59 1.78L12 12 4 7.7z" />
                <path fill="#34A853" d="M20 7.7L12 14 4.59 18.78A3 3 0 0 0 7 20h10a3 3 0 0 0 3-3V7.7z" />
              </svg>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Connect Gmail</p>
                <p className="text-xs text-muted-foreground">Google Workspace or personal Gmail</p>
              </div>
            </button>

            <button
              onClick={() => handleConnect("outlook")}
              className="flex w-full items-center gap-3 rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-muted/50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#0078D4" d="M24 7.388v10.224c0 .396-.321.717-.717.717h-8.566V6.67h8.566c.396 0 .717.321.717.718z" />
                <path fill="#0364B8" d="M14.717 6.67V18.33H.717A.717.717 0 0 1 0 17.612V7.388c0-.396.321-.717.717-.717h14z" />
                <path fill="#28A8EA" d="M14.717 6.67L7.359 12.5.717 6.67H14.717z" />
                <path fill="#0078D4" d="M0 7.388v10.224c0 .396.321.717.717.717h14V6.67H.717A.717.717 0 0 0 0 7.388z" />
                <ellipse cx="7.5" cy="12.5" rx="4" ry="3.5" fill="#fff" />
              </svg>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Connect Outlook</p>
                <p className="text-xs text-muted-foreground">Microsoft 365 or Outlook.com</p>
              </div>
            </button>

            <button
              onClick={() => handleConnect("manual")}
              className="flex w-full items-center gap-3 rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-muted/50"
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Manual Input</p>
                <p className="text-xs text-muted-foreground">Paste or forward emails manually</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  Connected
                </Badge>
                <span className="text-sm">
                  {connectedProvider === "gmail" ? "Gmail" : connectedProvider === "outlook" ? "Outlook" : "Manual Input"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>

            {connectedProvider === "manual" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Paste Email Content</label>
                <Textarea
                  placeholder="Paste supplier email content here..."
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button size="sm" className="w-full">
                  Process Email
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter Keywords</label>
              <p className="text-xs text-muted-foreground">Emails from these companies/contacts will be filtered</p>
              <div className="flex flex-wrap gap-1.5">
                {filterKeywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  className="h-8 text-sm"
                />
                <Button size="sm" variant="outline" onClick={addKeyword}>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Filtered Emails</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-7 w-40 pl-7 text-xs"
                  />
                </div>
              </div>
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {filteredEmails.map(email => {
                  const config = categoryConfig[email.category];
                  const Icon = config.icon;
                  return (
                    <div key={email.id} className="rounded-lg border p-3 transition-all hover:bg-muted/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-[10px] gap-1", config.color)}>
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{email.date}</span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-muted-foreground truncate">{email.from}</p>
                          <p className="text-sm font-medium truncate">{email.subject}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{email.snippet}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
