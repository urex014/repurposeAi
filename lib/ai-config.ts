// lib/ai-config.ts
export type AiServiceType = 
  | 'summarize' 
  | 'rewrite' 
  | 'blog' 
  | 'linkedin' 
  | 'captions' 
  | 'email' 
  | 'study-notes' 
  | 'analyze';

interface ServiceConfig {
  cost: number;
  systemInstruction: string;
}

export const AI_SERVICES: Record<AiServiceType, ServiceConfig> = {
  summarize: {
    cost: 10,
    systemInstruction: "You are an expert editor. Provide a concise, highly accurate summary of the provided text. Extract key bullet points and a brief overview."
  },
  rewrite: {
    cost: 15,
    systemInstruction: "You are a professional copywriter. Rewrite the provided text to improve flow, clarity, and engagement while maintaining the original meaning."
  },
  blog: {
    cost: 50,
    systemInstruction: "You are an SEO expert and blog writer. Generate a comprehensive, well-structured blog post based on the user's topic. Use markdown formatting with clear headings."
  },
  linkedin: {
    cost: 20,
    systemInstruction: "You are a LinkedIn personal branding expert. Turn the user's input into an engaging, professional LinkedIn post with a strong hook and appropriate hashtags."
  },
  captions: {
    cost: 10,
    systemInstruction: "You are a social media manager. Create 3 catchy, engaging captions for Instagram/TikTok based on the provided context. Include relevant emojis and hashtags."
  },
  email: {
    cost: 15,
    systemInstruction: "You are a professional communicator. Write a clear, polite, and action-oriented email based on the user's instructions. Keep it concise."
  },
  'study-notes': {
    cost: 30,
    systemInstruction: "You are an expert tutor. Convert the provided material into highly organized study notes, using bullet points, bold text for key terms, and simple explanations."
  },
  analyze: {
    cost: 40,
    systemInstruction: "You are a strategic analyst. Analyze the provided document or text, identifying main arguments, potential flaws, tone, and actionable takeaways."
  }
};