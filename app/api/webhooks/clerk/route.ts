import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { NextRequest } from 'next/server'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)
        const { id } = evt.data
        const eventType = evt.type

        try {

            if (eventType === "user.created") {
                const { id, email_addresses, first_name, last_name } = evt.data
                const full_name = `${first_name || ''} ${last_name || ''}`.trim()
                await db.user.create({
                    data: {
                        clerkId: id,
                        email: email_addresses[0].email_address,
                        name: full_name || null,
                    }
                })
            }

            if (eventType === "user.deleted") {
                const { id } = evt.data
                await db.user.delete({ where: { clerkId: id }, })
            }

        }

        catch (error: any) {
            return new Response(`Error processing webhook: ${error.message}`, { status: 400 })
        }

        return new Response(`User created successfully`, { status: 200 })
    } catch (err: any) {
        return new Response(`Error verifying webhook: ${err.message}`, { status: 400 })
    }
}