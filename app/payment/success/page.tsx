"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleVerifyKhaltiPayment } from "@/lib/actions/payment/payment-action";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const didRunRef = useRef(false);

    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;

        const pidx = sp.get("pidx");
        const rawBookingId =
            sp.get("purchase_order_id") ||
            sp.get("purchaseOrderId") ||
            sp.get("bookingId");
        const bookingId = rawBookingId
            ? rawBookingId.split("?")[0].replace(/\/+$/, "")
            : null;
        const khaltiStatus = (sp.get("status") || "").toLowerCase();

        if (!pidx || !bookingId) {
            toast.error("Missing payment info");
            return;
        }

        if (khaltiStatus && khaltiStatus !== "completed") {
            toast.error("Payment was not completed");
            router.replace(`/user/booking/${bookingId}`);
            return;
        }

        (async () => {
            const res = await handleVerifyKhaltiPayment({ pidx, bookingId });

            if (!res.success) {
                toast.error(res.message || "Payment verification failed");
                router.replace(`/user/booking/${bookingId}`);
                return;
            }

            toast.success("Payment verified!");
            router.replace(`/user/booking/${bookingId}`);
        })();
    }, [sp, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-black">
                    Verifying payment...
                </h1>
                <p className="mt-2 text-sm text-black/60">
                    Please don’t close this tab.
                </p>
            </div>
        </div>
    );
}
