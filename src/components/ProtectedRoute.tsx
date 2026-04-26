import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!session) {
        setChecking(false);
        return;
      }
      setChecking(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status,expires_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("subscription check error", error);
        setIsActive(false);
      } else {
        const active =
          data?.status === "active" &&
          (!data.expires_at || new Date(data.expires_at) > new Date());
        setIsActive(!!active);
      }
      setChecking(false);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (loading || (session && checking)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!isActive) {
    if (typeof window !== "undefined") {
      // Defer toast to next tick to avoid render warnings
      setTimeout(() => {
        toast.error("Please complete payment to access the dashboard.");
      }, 0);
    }
    return <Navigate to="/?pay=required#pricing" replace />;
  }

  return <>{children}</>;
};