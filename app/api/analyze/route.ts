import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    if (!idea || typeof idea !== "string") {
      return NextResponse.json(
        { error: "Invalid input. Please provide a valid plan or idea." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert product manager and execution coach. Your job is to take raw, unorganized human ideas/plans and structure them into clear, actionable components.

Your output MUST be a valid JSON object with EXACTLY this structure, no markdown wrapping around it:
{
  "_reasoningProcess": "string (Multi-step chain-of-thought: first analyze the core problem, then evaluate goal viability, then think step-by-step how to structure the best plan)",
  "structuredPlan": {
    "goal": "string (the overarching objective)",
    "method": "string (the approach or mechanism to achieve the goal)",
    "steps": ["string", "string"],
    "timeline": "string (the time component, or null if absolutely missing)"
  },
  "missingElements": {
    "goalClarity": "string (Identify critical gaps or vagueness in the user's goal. Provide 1 explicit improvement. NEVER leave empty.)",
    "executionSteps": "string (Identify missing steps or why current steps are vague. NEVER leave empty.)",
    "resourcesRequired": "string (Identify what specific resources, tools, money, or skills they forgot to mention. NEVER leave empty.)",
    "timeline": "string (Identify if a timeline is missing, unrealistic, or needs intermediate milestones. NEVER leave empty.)"
  },
  "simplifiedVersion": "string (a concise, clearer 1-2 sentence version of the user's input)",
  "actionableSteps": ["string", "string", "string"],
  "clarityScore": 0,
  "scoringLogicExplanation": "string (brief explanation why this score was given)"
}

Clarity Score Logic (0-100):
- +25 if a clear and defined GOAL is present.
- +25 if actionable and logical STEPS are present.
- +25 if a concrete TIMELINE is present.
- +25 for completeness, realism of METHOD, and resource awareness.
If the plan is very vague (e.g., "I want to be rich"), score should be under 20.

Missing Elements Detection Rules:
- You MUST provide detailed, critical feedback for all 4 categories in "missingElements". 
- Do NOT just summarize the plan. Explicitly state what the plan LACKS, or why the current phrasing is weak.
- Even if the plan is detailed, point out one missing edge case or gap for each category.

Analyze the user's input strictly according to these rules. Return ONLY the raw JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Plan/Idea: "${idea}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2, // low temperature for consistent JSON output
      }
    });

    const textOutput = response.text;
    let jsonOutput;
    
    try {
      jsonOutput = JSON.parse(textOutput || "{}");
    } catch (parseError) {
      console.error("Failed to parse Gemini output as JSON", textOutput);
      return NextResponse.json(
        { error: "AI produced invalid JSON output." },
        { status: 500 }
      );
    }

    return NextResponse.json(jsonOutput);

  } catch (error) {
    console.error("Error in AI processing:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error analyzing the plan. Details: " + errorMessage },
      { status: 500 }
    );
  }
}
