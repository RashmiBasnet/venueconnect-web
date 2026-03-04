"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleVerifyKhaltiPayment } from "@/lib/actions/payment/payment-action";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pidx = sp.get("pidx");
        const bookingId = sp.get("bookingId");

        if (!pidx || !bookingId) {
            toast.error("Missing payment info");
            setLoading(false);
            return;
        }

        (async () => {
            const res = await handleVerifyKhaltiPayment({ pidx, bookingId });

            if (!res.success) {
                toast.error(res.message || "Payment verification failed");
                setLoading(false);
                return;
            }

            toast.success("Payment verified!");
            router.replace(`/user/bookings/${bookingId}`);
        })();
    }, [sp, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-black">
                    {loading ? "Verifying payment..." : "Done"}
                </h1>
                <p className="mt-2 text-sm text-black/60">
                    Please don’t close this tab.
                </p>
            </div>
        </div>
    );
}