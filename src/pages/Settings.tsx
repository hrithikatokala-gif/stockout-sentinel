import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Company ID</Label>
              <span className="text-sm text-muted-foreground">{user?.company_id ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Name</Label>
              <span className="text-sm text-muted-foreground">{user?.full_name ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email notifications</Label>
              <Switch id="email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="stockout-notif">Stockout alerts</Label>
              <Switch id="stockout-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reorder-notif">Reorder reminders</Label>
              <Switch id="reorder-notif" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
