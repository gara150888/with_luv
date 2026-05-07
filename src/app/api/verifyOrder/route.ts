import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_SECRET_ID!,
});

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) return NextResponse.json({ isOk: false, message: "Unauthorized" });

        const { orderId, razorpayPaymentId, razorpaySignature } = await req.json();

        const body = orderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_ID!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) return NextResponse.json({ isOk: false, message: "Invalid signature" });

        const order = await razorpay.orders.fetch(orderId);

        const coinsToAdd = (order.amount as number) / 100;

        const dbUser = await prisma.user.findUnique({
            where: { clerkId }
        });

        if (!dbUser) return NextResponse.json({ isOk: false, message: "User not found" });

        await prisma.$transaction(async (tx) => {
            await tx.payment.create({
                data: {
                    userId: dbUser.id,
                    orderId,
                    razorpayPaymentId,
                    razorpaySignature,
                    amount: order.amount as number,
                    status: "SUCCESS",
                },
            });

            const coins = await tx.coins.upsert({
                where: { userId: dbUser.id },
                update: { balance: { increment: coinsToAdd } },
                create: { userId: dbUser.id, balance: coinsToAdd },
            });

            await tx.coinTransaction.create({
                data: {
                    userId: dbUser.id,
                    coinsId: coins.id,
                    amount: coinsToAdd,
                    reason: "Payment",
                }
            })
        });

        return NextResponse.json({
            isOk: true,
            coinsAdded: coinsToAdd,
        });

    } catch (error) {
        console.error("Payment Verify Error:", error);

        return NextResponse.json({
            isOk: false,
            message: "Server error",
        });
    }
}