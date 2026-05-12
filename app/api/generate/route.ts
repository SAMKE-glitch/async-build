import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let jobTitle = "the position"; // Default value
  
  try {
    const body = await request.json();
    jobTitle = body.jobTitle || jobTitle;

    if (!jobTitle || typeof jobTitle !== "string") {
      return NextResponse.json(
        { error: "Job title required" },
        { status: 400 }
      );
    }

    const prompt = `Generate 3 unique, different interview questions for a ${jobTitle} role. Return ONLY a JSON array of 3 strings. No other text.`;

    // Try multiple models with your Gemini API key
    const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
    
    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      console.log(`Trying ${model}...`);
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9 }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          console.log(`${model} response:`, text);
          
          const jsonMatch = text.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            if (Array.isArray(questions) && questions.length === 3) {
              return NextResponse.json({ questions, jobTitle, model });
            }
          }
        }
      } catch (err) {
        console.log(`${model} error:`, err);
      }
    }
    
    // If all Gemini models fail, return a clear error
    return NextResponse.json({ 
      error: "Rate limit exceeded. Please wait 1 minute and try again.",
      jobTitle,
      suggestion: "The free tier has limits. Wait 60 seconds and retry."
    }, { status: 429 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Server error",
      jobTitle: jobTitle || "unknown"
    }, { status: 500 });
  }
}
