import { BarChart3, LogOut, Settings, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/CartSheet";

interface AppHeaderProps {
  children?: React.ReactNode;
}

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/messages", label: "Messages" },
  { to: "/emails", label: "Emails" },
  { to: "/licenses", label: "Licenses" },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: HelpCircle },
];

export const AppHeader = ({ children }: AppHeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">restoq</h1>
              <p className="text-xs text-muted-foreground">Inventory Intelligence</p>
            </div>
          </div>
          
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {children}
          <CartSheet />
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.company_id}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
