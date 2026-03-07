// app/api/paystack/initialize/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, amount, credits } = await req.json()

    // Paystack expects the amount in the lowest currency denomination (e.g., Kobo for NGN).
    // So 5000 NGN = 500000 kobo.
    const amountInLowestDenomination = amount * 100

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: amountInLowestDenomination,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // Where to send them after paying
        metadata: {
          creditsToAssign: credits,
          custom_fields: [
            {
              display_name: "Plan Name",
              variable_name: "plan_name",
              value: plan
            }
          ]
        }
      }),
    })

    const data = await paystackRes.json()

    if (!data.status) {
      throw new Error(data.message)
    }

    // Return the authorization URL so the frontend can redirect the user
    return NextResponse.json({ checkoutUrl: data.data.authorization_url })

  } catch (error: any) {
    console.error("Paystack Init Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}