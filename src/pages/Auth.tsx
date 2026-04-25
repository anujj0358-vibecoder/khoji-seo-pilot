import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/khoji/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.13 1.62l3.07-3.07C17.45 1.86 14.97.9 12 .9 7.39.9 3.4 3.6 1.49 7.55l3.55 2.76C5.95 7.5 8.74 5 12 5z"/>
    <path fill="#4285F4" d="M23.49 12.27c0-.85-.08-1.66-.21-2.45H12v4.65h6.45c-.28 1.5-1.13 2.77-2.4 3.62l3.71 2.88c2.17-2 3.43-4.96 3.43-8.7z"/>
    <path fill="#FBBC05" d="M5.04 14.31c-.2-.6-.31-1.24-.31-1.91s.11-1.31.31-1.91L1.49 7.73C.79 9.13.4 10.7.4 12.4c0 1.7.39 3.27 1.09 4.67l3.55-2.76z"/>
    <path fill="#34A853" d="M12 23.9c3.24 0 5.95-1.07 7.94-2.9l-3.71-2.88c-1.03.69-2.35 1.1-4.23 1.1-3.26 0-6.05-2.5-7.04-5.81L1.49 16.17C3.4 20.12 7.39 23.9 12 23.9z"/>
  </svg>
);

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "signup" ? "Account created (mock)" : "Welcome back (mock)");
    navigate("/dashboard");
  };

  const handleGoogle = () => {
    toast.success("Google sign-in (mock)");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background bg-hero-radial flex flex-col">
      <div className="container py-6">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <h1 className="text-2xl font-bold text-foreground text-center">Welcome to Khoji</h1>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {mode === "signup" ? "Start your 3-day free trial" : "Log in to your account"}
            </p>

            <Button onClick={handleGoogle} type="button" className="mt-6 w-full bg-foreground text-background hover:bg-foreground/90 h-11">
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input id="email" type="email" required placeholder="you@startup.in" className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input id="password" type="password" required placeholder="••••••••" className="bg-background border-border text-foreground" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                {mode === "signup" ? "Create account" : "Log in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? (
                <>Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">Log in</button>
                </>
              ) : (
                <>New to Khoji?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline font-medium">Sign up</button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;