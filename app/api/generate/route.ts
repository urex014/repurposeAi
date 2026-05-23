// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import AiTask from '@/models/AiTask';
import { generateAiContent } from '@/lib/gemini';

// Define the specific prompts for your dashboard options
const PROMPT_TEMPLATES = {
  videoScript: "You are an expert video producer. Convert the following text into a highly engaging, 1-2 minute video script suitable for TikTok, Instagram Reels, or YouTube Shorts. Include visual cues (e.g., [Camera cuts to...]) and spoken dialogue.",
  socialPosts: "You are a viral social media manager. Create 3 to 5 highly engaging social media posts (suitable for LinkedIn or X/Twitter) based on the following text. Use strong hooks, appropriate line breaks, and 2-3 relevant hashtags per post.",
  newsletter: "You are an expert copywriter. Summarize the core value of the following text into a punchy, 150-200 word newsletter snippet. End with a strong Call to Action (CTA)."
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate User
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    // 2. Parse Request
    const body = await request.json();
    const { text, options } = body;

    if (!text) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Calculate how many credits are needed based on selected options
    const requestedTasks = Object.keys(options).filter(key => options[key as keyof typeof options]);
    const creditsNeeded = requestedTasks.length;

    if (creditsNeeded === 0) {
      return NextResponse.json({ error: 'No output formats selected' }, { status: 400 });
    }

    // 3. Check Database & Balance
    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < creditsNeeded) {
      return NextResponse.json({ 
        error: `Insufficient credits. You need ${creditsNeeded} but have ${user.credits}.` 
      }, { status: 403 });
    }

    // 4. Execute AI Tasks in Parallel (for maximum speed)
    const generationPromises = requestedTasks.map(async (taskType) => {
      const systemInstruction = PROMPT_TEMPLATES[taskType as keyof typeof PROMPT_TEMPLATES];
      
      const output = await generateAiContent({
        systemInstruction,
        userPrompt: text,
      });

      return { taskType, output };
    });

    // Wait for all selected Gemini API calls to finish
    const generatedResults = await Promise.all(generationPromises);

    // 5. Format the response object to match what your frontend expects
    const responseData: Record<string, string> = {};
    const taskRecordsToSave = [];

    for (const result of generatedResults) {
      responseData[result.taskType] = result.output;
      
      // Prepare DB records for history tracking
      taskRecordsToSave.push({
        userId: user._id,
        taskType: result.taskType,
        input: text.substring(0, 1000), // Trim input to save DB space
        output: result.output,
        creditsConsumed: 1,
      });
    }

    // 6. Deduct credits and save history atomically
    user.credits -= creditsNeeded;
    
    await Promise.all([
      user.save(),
      AiTask.insertMany(taskRecordsToSave)
    ]);

    // 7. Return to your frontend
    return NextResponse.json({
      success: true,
      data: responseData,
      creditsRemaining: user.credits,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Generate API Error]:', error);
    return NextResponse.json({ 
      error: error.message || 'An error occurred while generating content' 
    }, { status: 500 });
  }
}