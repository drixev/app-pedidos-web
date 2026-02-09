import { useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-mono text-sm text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return session ? <Dashboard /> : <Login />;
};

export default Index;
