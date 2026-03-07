// app/api/generate/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse Input
    const { text, options } = await req.json()
    const requestedOutputs = Object.keys(options).filter((key) => options[key])
    const creditsNeeded = requestedOutputs.length

    if (!text || creditsNeeded === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    // 3. Connect to DB & Check Credits
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user || (user.credits ?? 0) < creditsNeeded) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // 4. Prepare Prompts (System Instructions)
    const prompts: Record<string, string> = {
      videoScript: "Convert the provided blog post into a highly engaging 1-2 minute video script suitable for TikTok or Instagram Reels. Include visual cues in brackets [like this].",
      socialPosts: "Extract the core value from the provided blog post and write 3 distinct, engaging social media posts suitable for X (Twitter) or LinkedIn. Number them clearly.",
      newsletter: "Write a 150-200 word email newsletter summarizing the provided blog post. Make it conversational and end with a call to action."
    }

    // 5. Execute Gemini Calls Concurrently
    const aiPromises = requestedOutputs.map(async (type) => {
      // Initialize the model with the specific system instruction for this output type
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Lightning fast, perfect for text parsing
        systemInstruction: prompts[type],
      })

      const result = await model.generateContent(text)
      const responseText = result.response.text()

      return { type, content: responseText }
    })

    const resultsArray = await Promise.all(aiPromises)

    // Format results into an object
    const outputs = resultsArray.reduce((acc, curr) => {
      acc[curr.type] = curr.content
      return acc
    }, {} as Record<string, string>)

    // 6. Deduct Credits & Save Generated Content
    await db.collection("users").updateOne(
      { email: session.user.email },
      { $inc: { credits: -creditsNeeded } }
    )

    await db.collection("content").insertOne({
      userId: user._id,
      originalText: text,
      outputs,
      creditsUsed: creditsNeeded,
      createdAt: new Date(),
    })

    // 7. Return Success
    return NextResponse.json({
      success: true,
      data: outputs,
      remainingCredits: user.credits - creditsNeeded
    })

  } catch (error) {
    console.error("Gemini generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}