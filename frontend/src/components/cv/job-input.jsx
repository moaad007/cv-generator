"use client";

import { useState } from "react";
import { ClipboardPaste, ArrowRight, Sparkles, MessageSquare, FileText, Download, CheckCircle } from "lucide-react";

export default function JobInput({ onSubmit }) {
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = () => {
    if (!jobDescription.trim()) return;
    onSubmit({
      jobDescription: jobDescription.trim(),
      jobTitle: jobTitle.trim() || undefined,
      company: company.trim() || undefined,
    });
  };

  const steps = [
    { icon: MessageSquare, title: "AI Interviews You", desc: "Answer targeted questions about your experience" },
    { icon: FileText, title: "CV Gets Built", desc: "AI structures your info into a tailored CV" },
    { icon: Download, title: "Download PDF", desc: "Export a professional, ATS-friendly CV" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-teal text-xl">◆</span>
          <span className="font-bold text-navy text-lg">CVPilot</span>
        </div>
        <div className="text-sm text-muted-foreground">AI-Powered CV Builder</div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-teal-light text-navy px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} className="text-teal" />
              No forms. Just a conversation.
            </div>
            <h1 className="text-4xl font-bold text-navy mb-3 leading-tight">
              Build a CV for the job you<br />actually want.
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Paste a job description. Our AI interviews you about your experience and creates a tailored CV.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mx-auto mb-2">
                  <step.icon size={18} className="text-navy" />
                </div>
                <p className="text-xs font-medium text-navy">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-border p-6 space-y-4">
            {/* Job Description */}
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Job Description</label>
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={"Paste the full job description here...\n\nExample:\nWe are looking for a Frontend Developer with 2+ years of experience in React, TypeScript, and REST APIs. You will work with our design team to build responsive web applications..."}
                  rows={8}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-teal transition-colors placeholder:text-muted-foreground resize-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.readText().then((text) => setJobDescription(text)).catch(() => {});
                  }}
                  className="absolute top-3 right-3 p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste size={16} />
                </button>
              </div>
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-navy mb-2 block">
                  Job Title <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal transition-colors placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-navy mb-2 block">
                  Company <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal transition-colors placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!jobDescription.trim()}
              className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors text-sm"
            >
              Start Interview
              <ArrowRight size={16} />
            </button>

            <p className="text-xs text-center text-muted-foreground">
              The AI will ask 5–15 targeted questions based on the job requirements.
            </p>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-teal" />
              Free to use
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-teal" />
              BYOK (your own API key)
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-teal" />
              No signup required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
