"use client";

import { useState } from "react";
import ClarityGauge from "../components/ClarityGauge";

type AnalysisResult = {
  structuredPlan: {
    goal: string;
    method: string;
    steps: string[];
    timeline: string | null;
  };
  missingElements: {
    goalClarity: string;
    executionSteps: string;
    resourcesRequired: string;
    timeline: string;
  };
  simplifiedVersion: string;
  actionableSteps: string[];
  clarityScore: number;
  scoringLogicExplanation: string;
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [analyzedIdea, setAnalyzedIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      setError("Please enter your plan or idea first.");
      return;
    }
    
    setError("");
    setLoading(true);
    setAnalyzedIdea(idea);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: "4rem", paddingTop: "4rem" }}>
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "1rem" }}>
          Explain My <span className="text-gradient">Plan</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          Turn your vague ideas into clear, actionable, and structured execution plans instantly.
        </p>
      </header>

      {!result && (
        <section style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="glass-card">
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>What's on your mind?</h2>
            <textarea
              className="input-field"
              rows={6}
              placeholder="E.g., I want to start a YouTube channel and earn money quickly..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            {error && (
              <div style={{ color: "var(--error)", marginTop: "1rem", padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "0.5rem" }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button 
                className="btn-primary" 
                onClick={handleAnalyze}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {loading ? "Analyzing..." : "Structure My Plan"}
              </button>
            </div>
          </div>
        </section>
      )}

      {result && (
        <section className="animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* Results Header with Export Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }} className="no-print">
            <h2 style={{ fontSize: "1.5rem" }}>Your Structured Execution Plan</h2>
            <button 
              onClick={() => window.print()}
              className="badge shadow-sm" 
              style={{ cursor: "pointer", background: "var(--accent-gradient)", color: "white", border: "none", padding: "0.5rem 1rem" }}
            >
              📄 Export PDF / Print
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
            
            {/* Left Column: Score & Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="glass-card" style={{ textAlign: "center" }}>
                <h3 style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>Clarity Score</h3>
                <ClarityGauge score={result.clarityScore} />
                <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  {result.scoringLogicExplanation}
                </p>
              </div>

              <div className="glass-card">
                <h3 style={{ marginBottom: "1.5rem", color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  ✨ Clarity Transformation
                </h3>
                <div style={{ marginBottom: "1rem", paddingBottom: "1.5rem", borderBottom: "1px dashed var(--glass-border)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Before (Raw Idea)</span>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "0.5rem" }}>"{analyzedIdea}"</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>After (Structured Focus)</span>
                  <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "0.5rem", fontWeight: "500", color: "var(--text-primary)" }}>{result.simplifiedVersion}</p>
                </div>
              </div>


            </div>

            {/* Right Column: Breakdown & Missing Elements */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              <div className="glass-card">
                <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.75rem" }}>Structured Breakdown</h3>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="badge" style={{ marginBottom: "0.5rem" }}>Goal</span>
                  <p>{result.structuredPlan.goal}</p>
                </div>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="badge" style={{ marginBottom: "0.5rem" }}>Method / Approach</span>
                  <p>{result.structuredPlan.method}</p>
                </div>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="badge" style={{ marginBottom: "0.5rem" }}>Timeline</span>
                  <p>{result.structuredPlan.timeline || "No timeline provided."}</p>
                </div>
                
                <div>
                  <span className="badge" style={{ marginBottom: "0.5rem" }}>Intended Steps</span>
                  <ol style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", color: "var(--text-secondary)" }}>
                    {result.structuredPlan.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>
              </div>

              <div className="glass-card" style={{ border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <h3 style={{ marginBottom: "1.5rem", color: "var(--warning)" }}>Missing Elements & Gaps</h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <strong style={{ display: "block", color: "white", marginBottom: "0.25rem" }}>Goal Clarity</strong>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{result.missingElements.goalClarity}</p>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "white", marginBottom: "0.25rem" }}>Execution Steps</strong>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{result.missingElements.executionSteps}</p>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "white", marginBottom: "0.25rem" }}>Resources</strong>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{result.missingElements.resourcesRequired}</p>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "white", marginBottom: "0.25rem" }}>Timeline</strong>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{result.missingElements.timeline}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Centered Actions to Take */}
          <div className="glass-card" style={{ marginTop: "2rem", maxWidth: "800px", margin: "2rem auto 0 auto" }}>
            <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>Actions to Take</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {result.actionableSteps.map((step, idx) => (
                <li key={idx} style={{ 
                  padding: "0.75rem", 
                  borderBottom: idx !== result.actionableSteps.length - 1 ? "1px solid var(--glass-border)" : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem"
                }}>
                  <span style={{ color: "var(--success)" }}>→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <h3 style={{ marginBottom: "1rem" }}>Want to refine your plan?</h3>
            <textarea
              className="input-field"
              rows={4}
              style={{ maxWidth: "800px", margin: "0 auto", display: "block", marginBottom: "1rem" }}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button className="btn-primary" onClick={handleReset} style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-primary)", boxShadow: "none" }}>Start Over</button>
              <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
                {loading ? "Re-Analyzing..." : "Analyze Updated Plan"}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
