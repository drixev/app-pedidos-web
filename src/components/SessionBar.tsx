import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Timer, User } from "lucide-react";

const SessionBar = () => {
  const { session, logout, timeRemaining } = useAuth();
  if (!session) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining < 300;

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-bold tracking-tight text-foreground">
          dev::orders
        </span>
        <span className="hidden sm:inline-block rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
          CRUD v1.0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5">
          <Timer className={`h-3.5 w-3.5 ${isLow ? "text-destructive animate-pulse-dot" : "text-muted-foreground"}`} />
          <span className={`font-mono text-xs tabular-nums ${isLow ? "text-destructive" : "text-muted-foreground"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span className="font-mono text-xs">{session.user.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="font-mono text-xs text-muted-foreground hover:text-destructive">
          <LogOut className="mr-1 h-3.5 w-3.5" />
          logout
        </Button>
      </div>
    </header>
  );
};

export default SessionBar;
