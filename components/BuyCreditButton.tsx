"use client"
import { useState } from "react"

export function BuyCreditsButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "Pro Pack",
          amount: 5000, // E.g., 5000 NGN
          credits: 50   // Number of credits to grant
        })
      })

      const data = await res.json()
      if (data.checkoutUrl) {
        // Redirect the user to the Paystack secure checkout page
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error("Checkout failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
    >
      {loading ? "Loading..." : "Buy 50 Credits (₦5,000)"}
    </button>
  )
}