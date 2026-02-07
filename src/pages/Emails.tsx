import { useState } from "react";
import { Mail, Plus, X, Search, Building2, User, Truck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
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
  {
    id: "5",
    from: "orders@valleyfarms.com",
    subject: "Delivery Scheduled: Fresh Produce Order #7821",
    snippet: "Your produce order including Roma Tomatoes, Fresh Basil, and Bell Peppers is scheduled for...",
    date: "3 days ago",
    category: "delivery",
  },
  {
    id: "6",
    from: "updates@freshmeats.com",
    subject: "Weekly Price List - Protein Products",
    snippet: "Please find attached our updated weekly price list for all protein products including...",
    date: "4 days ago",
    category: "pricing",
  },
];

const categoryConfig = {
  supplier: { label: "Supplier", icon: Building2, color: "bg-blue-500/10 text-blue-600" },
  delivery: { label: "Delivery", icon: Truck, color: "bg-green-500/10 text-green-600" },
  pricing: { label: "Pricing", icon: User, color: "bg-amber-500/10 text-amber-600" },
  urgent: { label: "Urgent", icon: AlertTriangle, color: "bg-red-500/10 text-red-600" },
};

const Emails = () => {
  const [connectedProvider, setConnectedProvider] = useState<EmailProvider>(null);
  const [filterKeywords, setFilterKeywords] = useState<string[]>(["sysco", "usfoods", "gordon", "performance food", "valley farms", "freshmeats"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleConnect = (provider: EmailProvider) => {
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

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || email.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Email Integration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your email to filter supplier communications
          </p>
        </div>

        {!connectedProvider ? (
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Connect Your Email</h3>
                <p className="text-sm text-muted-foreground">Choose how to connect your email for supplier communications</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => handleConnect("gmail")}
                className="flex flex-col items-center gap-3 rounded-lg border p-6 transition-all hover:border-primary/50 hover:bg-muted/50"
              >
                <svg className="h-10 w-10" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.27 5.27L12 10.9l6.73-5.63A2 2 0 0 0 17.32 4H6.68a2 2 0 0 0-1.41.59v.68z" />
                  <path fill="#4285F4" d="M20 7.7l-8 6.3-8-6.3V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7.7z" />
                  <path fill="#FBBC05" d="M4 7.7V17a3 3 0 0 0 .59 1.78L12 12 4 7.7z" />
                  <path fill="#34A853" d="M20 7.7L12 14 4.59 18.78A3 3 0 0 0 7 20h10a3 3 0 0 0 3-3V7.7z" />
                </svg>
                <div className="text-center">
                  <p className="font-medium">Gmail</p>
                  <p className="text-xs text-muted-foreground">Google Workspace or personal</p>
                </div>
              </button>

              <button
                onClick={() => handleConnect("outlook")}
                className="flex flex-col items-center gap-3 rounded-lg border p-6 transition-all hover:border-primary/50 hover:bg-muted/50"
              >
                <svg className="h-10 w-10" viewBox="0 0 24 24">
                  <path fill="#0078D4" d="M24 7.388v10.224c0 .396-.321.717-.717.717h-8.566V6.67h8.566c.396 0 .717.321.717.718z" />
                  <path fill="#0364B8" d="M14.717 6.67V18.33H.717A.717.717 0 0 1 0 17.612V7.388c0-.396.321-.717.717-.717h14z" />
                  <path fill="#28A8EA" d="M14.717 6.67L7.359 12.5.717 6.67H14.717z" />
                  <path fill="#0078D4" d="M0 7.388v10.224c0 .396.321.717.717.717h14V6.67H.717A.717.717 0 0 0 0 7.388z" />
                  <ellipse cx="7.5" cy="12.5" rx="4" ry="3.5" fill="#fff" />
                </svg>
                <div className="text-center">
                  <p className="font-medium">Outlook</p>
                  <p className="text-xs text-muted-foreground">Microsoft 365 or Outlook.com</p>
                </div>
              </button>

              <button
                onClick={() => handleConnect("manual")}
                className="flex flex-col items-center gap-3 rounded-lg border p-6 transition-all hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="rounded-lg bg-muted p-2">
                  <Mail className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Manual Input</p>
                  <p className="text-xs text-muted-foreground">Paste or forward emails</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        Connected
                      </Badge>
                      <span className="font-medium">
                        {connectedProvider === "gmail" ? "Gmail" : connectedProvider === "outlook" ? "Outlook" : "Manual Input"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Filtering supplier communications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>

            {/* Manual Input Section */}
            {connectedProvider === "manual" && (
              <div className="rounded-lg border bg-card p-4 space-y-3">
                <label className="text-sm font-medium">Paste Email Content</label>
                <Textarea
                  placeholder="Paste supplier email content here..."
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Process Email
                </Button>
              </div>
            )}

            {/* Filter Keywords */}
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Filter Keywords</label>
                <p className="text-xs text-muted-foreground">Emails from these companies/contacts will be filtered</p>
              </div>
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
                  className="max-w-xs"
                />
                <Button size="sm" variant="outline" onClick={addKeyword}>
                  Add
                </Button>
              </div>
            </div>

            {/* Filtered Emails */}
            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold">Filtered Emails</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {["all", "delivery", "pricing", "urgent", "supplier"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium transition-all capitalize",
                            activeCategory === cat
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divide-y">
                {filteredEmails.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No emails match your search
                  </div>
                ) : (
                  filteredEmails.map(email => {
                    const config = categoryConfig[email.category];
                    const Icon = config.icon;
                    return (
                      <div key={email.id} className="p-4 transition-all hover:bg-muted/50">
                        <div className="flex items-start gap-4">
                          <div className={cn("rounded-lg p-2 shrink-0", config.color)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={cn("text-xs", config.color)}>
                                {config.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{email.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{email.from}</p>
                            <p className="font-medium truncate">{email.subject}</p>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{email.snippet}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Emails;
