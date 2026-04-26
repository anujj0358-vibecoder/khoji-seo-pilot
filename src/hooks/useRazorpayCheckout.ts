import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export const useRazorpayCheckout = () => {
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(
    async (opts: { onSuccess?: () => void; onDismiss?: () => void } = {}) => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          toast.error("Please sign in to continue");
          setLoading(false);
          return;
        }

        const scriptOk = await loadRazorpayScript();
        if (!scriptOk) {
          toast.error("Failed to load Razorpay. Please try again.");
          setLoading(false);
          return;
        }

        const { data: orderData, error: orderErr } = await supabase.functions.invoke(
          "razorpay-create-order",
          { body: {} }
        );
        if (orderErr || !orderData?.order_id) {
          console.error("create-order error", orderErr, orderData);
          toast.error("Could not start payment. Please try again.");
          setLoading(false);
          return;
        }

        const user = sessionData.session.user;

        const rzp = new window.Razorpay({
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Khoji",
          description: "Khoji Pro — SEO Co-pilot",
          order_id: orderData.order_id,
          theme: { color: "#E8540A" },
          prefill: {
            email: user.email ?? "",
            name: (user.user_metadata?.full_name as string) ?? "",
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              opts.onDismiss?.();
            },
          },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            const { error: vErr } = await supabase.functions.invoke(
              "razorpay-verify-payment",
              { body: response }
            );
            if (vErr) {
              console.error("verify error", vErr);
              toast.error("Payment verification failed. Contact support.");
              setLoading(false);
              return;
            }
            toast.success("Payment successful! Welcome to Khoji Pro.");
            setLoading(false);
            opts.onSuccess?.();
          },
        });

        rzp.on("payment.failed", (resp: any) => {
          console.error("payment failed", resp?.error);
          toast.error(resp?.error?.description ?? "Payment failed");
          setLoading(false);
        });

        rzp.open();
      } catch (err) {
        console.error("checkout error", err);
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    []
  );

  return { startCheckout, loading };
};