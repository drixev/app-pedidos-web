import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Terminal, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("user1@example.com");
  const [password, setPassword] = useState("user123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
    } catch {
      setError("Invalid credentials. Use any email + password (4+ chars).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card animate-slide-in">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-mono text-2xl tracking-tight">dev::orders</CardTitle>
          <CardDescription className="font-mono text-xs text-muted-foreground">
            CRUD Order Management • v1.0.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono bg-secondary border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono bg-secondary border-border"
                required
                minLength={4}
              />
            </div>
            {error && (
              <p className="font-mono text-xs text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full font-mono" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Authenticating..." : "$ login --auth"}
            </Button>
            <p className="text-center font-mono text-xs text-muted-foreground">
              Hint: any email + password (4+ chars)
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
