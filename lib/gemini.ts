import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Use gemini-pro instead of gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateQuestions(jobTitle: string): Promise<string[]> {
  const prompt = `You are an experienced hiring manager.

Generate exactly 3 interview questions for a ${jobTitle} role.

Requirements:
- Question 1: Behavioral (past experience)
- Question 2: Situational/Problem-solving (hypothetical scenario)
- Question 3: Role-specific competency (technical or domain knowledge)

Constraints:
- Make questions concise, practical, and specific to ${jobTitle}
- Avoid generic questions like "tell me about yourself"
- Return ONLY a valid JSON array of exactly 3 strings

Example: ["Question 1?", "Question 2?", "Question 3?"]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Invalid response format");
  
  const questions = JSON.parse(jsonMatch[0]);
  
  if (!Array.isArray(questions) || questions.length !== 3) {
    throw new Error("Expected 3 questions");
  }
  
  return questions;
}
