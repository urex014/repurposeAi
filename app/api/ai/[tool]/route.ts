/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/ai/[tool]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import AiTask from '@/models/AiTask';
import CreditUsage from '@/models/CreditUsage';
import { generateAiContent } from '@/lib/gemini';
import { AI_SERVICES, AiServiceType } from '@/lib/ai-config';
import { getUserIdFromRequest } from '@/lib/auth';

// In Next.js 15+, dynamic route params are a Promise
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    // 1. Await params and validate the tool
    const { tool } = await params;
    const serviceConfig = AI_SERVICES[tool as AiServiceType];

    if (!serviceConfig) {
      return NextResponse.json({ error: 'Invalid AI service requested' }, { status: 400 });
    }

    // 2. Authenticate the user
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Parse user input
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    // 4. Connect to database and fetch user
    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5. Check credit balance
    if (user.credits < serviceConfig.cost) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        required: serviceConfig.cost,
        balance: user.credits 
      }, { status: 403 });
    }

    // 6. Call the Gemini API Utility
    const aiOutput = await generateAiContent({
      systemInstruction: serviceConfig.systemInstruction,
      userPrompt: prompt,
    });

    // 7. Deduct credits and log the transaction (Running in parallel for speed)
    user.credits -= serviceConfig.cost;

    await Promise.all([
      user.save(),
      
      CreditUsage.create({
        userId: user._id,
        service: tool as any,
        creditsUsed: serviceConfig.cost,
        prompt: prompt.substring(0, 500), // Only store the first 500 chars to save DB space
      }),
      
      AiTask.create({
        userId: user._id,
        taskType: tool as any,
        input: prompt,
        output: aiOutput,
        creditsConsumed: serviceConfig.cost,
      })
    ]);

    // 8. Return the payload to the frontend
    return NextResponse.json({
      success: true,
      output: aiOutput,
      creditsRemaining: user.credits,
    }, { status: 200 });

  } catch (error: any) {
    console.error(`[AI Route Error - ${error.message}]:`, error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request' 
    }, { status: 500 });
  }
}