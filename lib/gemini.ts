// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface GenerateContentParams {
  systemInstruction: string;
  userPrompt: string;
  temperature?: number;
}

/**
 * A centralized utility to interact with the Gemini API.
 * Uses gemini-1.5-flash for the best balance of speed, cost, and text capability.
 */
export async function generateAiContent({
  systemInstruction,
  userPrompt,
  temperature = 0.7,
}: GenerateContentParams): Promise<string> {
  try {
    // Initialize the model with the specific system instruction for the current task
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-lite',
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature,
        // You can add maxOutputTokens or topP here if needed for specific services
      },
    });

    console.log(`[Gemini API] Generating content. Prompt length: ${userPrompt.length} chars`);

    // Execute the prompt
    const result = await model.generateContent(userPrompt);
    const textOutput = result.response.text();

    console.log(`[Gemini API] Success. Output length: ${textOutput.length} chars`);

    return textOutput;
  } catch (error) {
    // Graceful error logging to prevent raw stack traces from leaking to the frontend
    console.error('[Gemini API] Task Failed:', error);
    
    // Throw a generic, safe error message to be caught by the Next.js API route
    throw new Error('AI generation failed. Please try again or contact support.');
  }
}