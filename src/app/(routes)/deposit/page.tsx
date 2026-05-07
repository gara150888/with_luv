"use client";

import Script from "next/script";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Wallet, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner"

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

function DepositPage() {
    const [amount, setAmount] = useState(500);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [minAmount, setMinAmount] = useState(10);
    const [maxAmount, setMaxAmount] = useState(100000);

    const handleAmountChange = (value: string | number) => {
        const num = parseInt(value.toString()) || 0;
        setAmount(num);
        setError("");
    };

    const selectPreset = (preset: number) => {
        setAmount(preset);
        setError("");
    };

    const createOrder = async () => {
        if (!amount || amount < minAmount) {
            setError(`Minimum deposit amount is ₹${minAmount}`);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/createOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amount * 100 }),
            });

            if (!res.ok) throw new Error("Failed to create order");

            const data = await res.json();

            const paymentData = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                order_id: data.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/verifyOrder", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            orderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.isOk) {
                        toast.success("Payment successful! Amount credited to your wallet.");
                        setAmount(500);
                    } else {
                        toast.error("Payment failed. Please try again.");
                    }
                },
            };

            const payment = new (window as any).Razorpay(paymentData);
            payment.open();
        } catch (err) {
            setError("Failed to initiate payment. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-3 sm:p-6">
            <Script
                type="text/javascript"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="flex flex-col w-full max-w-md gap-6">

                <Card className="bg-card">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Wallet className="h-5 w-5 text-primary" />
                            Deposit Amount
                        </CardTitle>
                        <CardDescription>Choose a preset or enter custom amount</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => selectPreset(preset)}
                                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${amount === preset
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    ₹{preset}
                                </button>
                            ))}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Custom Amount</label>
                            <div className="relative pt-2">
                                <span className="absolute left-3 top-[57%] translate-y-[-50%] text-muted-foreground">₹</span>
                                <Input
                                    type="number"
                                    min={minAmount}
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    className="pl-7 h-12 text-lg"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Min: ₹{minAmount} • Max: ₹{maxAmount}</p>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col gap-4">
                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Amount</span>
                                <span>₹{amount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Processing Fee</span>
                                <span className="text-green-500">₹0</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{amount}</span>
                            </div>
                        </div>

                        <Button
                            onClick={createOrder}
                            disabled={loading || amount < minAmount}
                            className="w-full h-12 text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Pay ₹{amount}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>All Cards Accepted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepositPage;
