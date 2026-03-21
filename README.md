# Explain My Plan — AI Clarity & Structuring Tool

Live Application Link: [https://explain-my-plan-theta.vercel.app/]

## 1. Project Overview
Individuals often have vague, unstructured ideas that struggle to translate into execution. This web application accepts raw, natural language plans from users and converts them into a structured, executable format using AI (Gemini 2.5). It provides missing elements gap analysis, a summarized clear version, actionable next steps, and an overall Clarity Score.

**Features:**
- Clean, premium Glassmorphic UI with vibrant gradients and smooth interactions.
- Extracts explicit Goal, Approach, Steps, and Timeline.
- Gap Analysis: Identifies missing elements in clarity, resources, and timeline.
- Dynamic Clarity Score Gauge (0-100).
- Iterative refinement.

## 2. Setup Instructions
To run this project locally:

1. Clone the repository and navigate to the root directory `assig`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variable by creating a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:3000`.

## 3. Explanation of Prompt Design
The AI prompt is structured to enforce a strict JSON schema for robust parsing on the backend, without markdown wrapping. 
- We assign the AI a persona: "expert product manager and execution coach".
- We dictate exact JSON keys (`structuredPlan`, `missingElements`, `simplifiedVersion`, `actionableSteps`, `clarityScore`) to ensure predictable components map to our React state.
- For `missingElements`, the AI is explicitly told to assess gaps across specific categories (goal, execution, resources, timeline) providing targeted feedback.

## 4. Explanation of Clarity Score Logic
The Clarity Score ranges from 0 to 100 based on a deterministic evaluation rubric implicitly calculated by the LLM logic instructions. The LLM adds points cumulatively based on the input text:
- **+25 points** if a clear and defined GOAL is present.
- **+25 points** if actionable and logical STEPS are outlined.
- **+25 points** if a concrete TIMELINE or deadline is identified.
- **+25 points** for overall completeness, realism of METHOD, and resource awareness.

A very vague input (e.g., "I want to be rich") inherently lacks steps, timeline, and realistic methodology, resulting in a score under 20. The LLM also returns a `scoringLogicExplanation` string to provide transparency on why the exact score was given.

## 5. Short Note
**Challenges Faced:** 
One of the main challenges was ensuring the LLM consistently returns strict JSON without hallucinated markdown formatting blocks (like \`\`\`json). This was overcome by leveraging the `@google/genai` SDK and configuring `responseMimeType: "application/json"`, along with setting a low temperature (0.2) to maintain deterministic, highly predictable formatting outputs.

**Approach to AI Prompting:** 
I focused on zero-shot constrained extraction. Instead of asking the AI to 'write a plan', I instructed the AI to 'extract and evaluate' an existing plan based on distinct categories. The explicit role instruction and the JSON blueprint guaranteed the AI's response matched the React frontend model perfectly, avoiding runtime parsing errors. Additionally, standardizing the gap-analysis forces the model to critically evaluate rather than just summarize the user's data.
