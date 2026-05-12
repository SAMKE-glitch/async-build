"use client";

import { useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      setError("Job title required");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: jobTitle.trim() }),
      });

      const data = await response.json();
      console.log("Data received:", data);
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("No questions received");
      }
    } catch (err) {
      setError("Failed to generate questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
        Interview Questions Generator
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Enter a job title to get 3 thoughtful interview questions
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Customer Success Manager, Software Engineer"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px",
            fontSize: "16px"
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#9CA3AF" : "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </form>

      {error && (
        <div style={{
          backgroundColor: "#FEE2E2",
          border: "1px solid #FCA5A5",
          padding: "12px",
          borderRadius: "5px",
          marginBottom: "20px",
          color: "#991B1B"
        }}>
          {error}
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>
            Questions for {jobTitle}
          </h2>
          {questions.map((question, index) => (
            <div
              key={index}
              style={{
                borderLeft: "4px solid #2563EB",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#F9FAFB",
                borderRadius: "5px"
              }}
            >
              <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "5px" }}>
                Question {index + 1}
              </div>
              <p style={{ fontSize: "16px", color: "#1F2937", margin: 0 }}>
                {question}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && questions.length === 0 && !error && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#9CA3AF"
        }}>
          Enter a job title above to generate interview questions
        </div>
      )}
    </main>
  );
}
