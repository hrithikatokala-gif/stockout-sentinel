import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { z } from "zod";

const companyIdSchema = z.string()
  .min(3, "Company ID must be at least 3 characters")
  .max(50, "Company ID must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Company ID can only contain letters, numbers, dashes, and underscores");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const managerIdSchema = z.string().min(1, "Manager ID is required").max(100, "Manager ID must be less than 100 characters");

export default function Auth() {
  // Sign in state
  const [signInCompanyId, setSignInCompanyId] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInErrors, setSignInErrors] = useState<{ companyId?: string; password?: string }>({});

  // Sign up state
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1);
  const [signUpCompanyId, setSignUpCompanyId] = useState("");
  const [managerId, setManagerId] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<{ companyId?: string; managerId?: string; password?: string; confirmPassword?: string }>({});

  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { companyId?: string; password?: string } = {};

    const cResult = companyIdSchema.safeParse(signInCompanyId);
    if (!cResult.success) newErrors.companyId = cResult.error.errors[0].message;

    const pResult = passwordSchema.safeParse(signInPassword);
    if (!pResult.success) newErrors.password = pResult.error.errors[0].message;

    setSignInErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await signIn(signInCompanyId, signInPassword);
    if (error) {
      toast({ variant: "destructive", title: "Sign in failed", description: error });
    } else {
      toast({ title: "Welcome back!", description: "You have successfully signed in." });
    }
    setLoading(false);
  };

  const handleSignUpStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { companyId?: string; managerId?: string } = {};

    const cResult = companyIdSchema.safeParse(signUpCompanyId);
    if (!cResult.success) newErrors.companyId = cResult.error.errors[0].message;

    const mResult = managerIdSchema.safeParse(managerId);
    if (!mResult.success) newErrors.managerId = mResult.error.errors[0].message;

    setSignUpErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSignUpStep(2);
  };

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { password?: string; confirmPassword?: string } = {};

    const pResult = passwordSchema.safeParse(signUpPassword);
    if (!pResult.success) newErrors.password = pResult.error.errors[0].message;

    if (signUpPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setSignUpErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await signUp(signUpCompanyId, signUpPassword, managerId);
    if (error) {
      toast({ variant: "destructive", title: "Sign up failed", description: error });
    } else {
      toast({ title: "Account created!", description: "Welcome to restoq." });
    }
    setLoading(false);
  };

  const resetSignUp = () => {
    setSignUpStep(1);
    setSignUpPassword("");
    setConfirmPassword("");
    setSignUpErrors({});
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight">restoq</h1>
              <p className="text-xs text-muted-foreground">Inventory Intelligence</p>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in with your Company ID or create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full" onValueChange={() => resetSignUp()}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* ── Sign In ── */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-company-id">Company ID</Label>
                  <Input
                    id="signin-company-id"
                    type="text"
                    placeholder="your-company-id"
                    value={signInCompanyId}
                    onChange={(e) => setSignInCompanyId(e.target.value)}
                    required
                  />
                  {signInErrors.companyId && (
                    <p className="text-sm text-destructive">{signInErrors.companyId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                    >
                      {showSignInPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {signInErrors.password && (
                    <p className="text-sm text-destructive">{signInErrors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* ── Sign Up ── */}
            <TabsContent value="signup">
              {signUpStep === 1 ? (
                <form onSubmit={handleSignUpStep1} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-company-id">Company ID</Label>
                    <Input
                      id="signup-company-id"
                      type="text"
                      placeholder="your-company-id"
                      value={signUpCompanyId}
                      onChange={(e) => setSignUpCompanyId(e.target.value)}
                      required
                    />
                    {signUpErrors.companyId && (
                      <p className="text-sm text-destructive">{signUpErrors.companyId}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Letters, numbers, dashes, and underscores only
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-manager-id">Manager ID</Label>
                    <Input
                      id="signup-manager-id"
                      type="text"
                      placeholder="Manager name or ID"
                      value={managerId}
                      onChange={(e) => setManagerId(e.target.value)}
                      required
                    />
                    {signUpErrors.managerId && (
                      <p className="text-sm text-destructive">{signUpErrors.managerId}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignUpStep2} className="space-y-4">
                  <button
                    type="button"
                    onClick={resetSignUp}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>

                  <div className="rounded-md border border-border bg-muted/50 p-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">Company ID:</span>
                      <span className="font-medium">{signUpCompanyId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">Manager ID:</span>
                      <span className="font-medium">{managerId}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Create Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      >
                        {showSignUpPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {signUpErrors.password && (
                      <p className="text-sm text-destructive">{signUpErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {signUpErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{signUpErrors.confirmPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
