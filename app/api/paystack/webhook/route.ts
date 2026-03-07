// app/api/paystack/webhook/route.ts
import { NextResponse } from "next/server"
import crypto from "crypto"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    // 1. Get the raw body as text for signature verification
    const rawBody = await req.text()
    const signature = req.headers.get("x-paystack-signature")

    // 2. Verify the signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
      .update(rawBody)
      .digest("hex")

    if (hash !== signature) {
      console.error("Invalid Paystack Signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // 3. Parse the event
    const event = JSON.parse(rawBody)

    // 4. Handle successful charges
    if (event.event === "charge.success") {
      const email = event.data.customer.email
      const creditsToAdd = event.data.metadata.creditsToAssign

      // Connect to MongoDB and add the credits
      const client = await clientPromise
      const db = client.db()

      await db.collection("users").updateOne(
        { email: email },
        { $inc: { credits: creditsToAdd } }
      )

      console.log(`Successfully added ${creditsToAdd} credits to ${email}`)
    }

    // Always return a 200 OK so Paystack knows you received the webhook
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error("Webhook Error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}