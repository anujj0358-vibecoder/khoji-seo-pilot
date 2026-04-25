import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

const AccountPage = () => {
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
              <span className="text-2xl font-bold">₹799</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-semibold">
            <Check className="h-3 w-3" /> Active
          </span>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <Field label="Email" value="founder@startup.in" />
          <Field label="Next billing date" value="May 22, 2025" />
          <Field label="Payment method" value="Razorpay · UPI" />
          <Field label="Member since" value="April 19, 2025" />
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