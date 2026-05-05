import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)
        const { id } = evt.data
        const eventType = evt.type

        try {

            if (eventType === "user.created") { }
            if (eventType === "user.deleted") { }

        }

        catch (error: any) {
            return new Response(`Error processing webhook: ${error.message}`, { status: 400 })
        }

        return new Response(`User created successfully`, { status: 200 })
    } catch (err: any) {
        return new Response(`Error verifying webhook: ${err.message}`, { status: 400 })
    }
}