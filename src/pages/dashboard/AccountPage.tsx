import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type Sub = {
  status: string;
  plan: string | null;
  amount_paise: number | null;
  activated_at: string | null;
  expires_at: string | null;
  created_at: string;
};

const AccountPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Sub | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("subscriptions")
        .select("status, plan, amount_paise, activated_at, expires_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      setSub((data as Sub) ?? null);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isActive =
    sub?.status === "active" &&
    (!sub.expires_at || new Date(sub.expires_at) > new Date());
  const priceRupees = sub?.amount_paise ? Math.round(sub.amount_paise / 100) : 499;
  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Account</h1>
        <p className="mt-2 text-muted-foreground">Manage your subscription and billing.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current plan</div>
            <h2 className="text-2xl font-bold text-foreground mt-1">Khoji Pro</h2>
            <div className="mt-1 text-foreground">
              <span className="text-2xl font-bold">₹{priceRupees}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-semibold">
              <Check className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-semibold">
              {sub?.status ?? "inactive"}
            </span>
          )}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <Field label="Email" value={user?.email ?? "—"} />
          <Field label="Next billing date" value={fmt(sub?.expires_at)} />
          <Field label="Payment method" value="Razorpay · UPI" />
          <Field label="Member since" value={fmt(sub?.activated_at ?? sub?.created_at ?? user?.created_at)} />
        </div>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-card p-8 shadow-card">
        <h3 className="text-lg font-bold text-foreground">Cancel subscription</h3>
        <p className="mt-2 text-sm text-muted-foreground">You'll keep access until the end of your billing period.</p>
        <Button onClick={() => toast.info("Cancellation flow not wired yet")} variant="outline" className="mt-4 border-destructive/60 text-destructive hover:bg-destructive/10 hover:text-destructive">
          Cancel subscription
        </Button>
      </section>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-background px-4 py-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-foreground font-medium mt-0.5">{value}</div>
  </div>
);

export default AccountPage;