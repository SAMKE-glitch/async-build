import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
  );
  const data = await response.json();
  
  // Return just the model names that support generateContent
  const models = data.models
    ?.filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m: any) => m.name) || [];
  
  return NextResponse.json({ models });
}
