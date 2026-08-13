"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Settings, CheckCircle, Download } from "lucide-react";
import Sidebar from "@/components/cv/sidebar";
import ChatPanel from "@/components/cv/chat-panel";
import CvPreview from "@/components/cv/cv-preview";
import JobInput from "@/components/cv/job-input";
import SettingsDialog from "@/components/cv/settings-dialog";
import TemplateSelector from "@/components/cv/template-selector";
import { generatePDF } from "@/lib/pdf";
import { saveSession, generateSessionId } from "@/lib/api";

const STAGE_ORDER = ["personal", "education", "experience", "skills", "summary"];
const STORAGE_KEY = "cvpilot_state";
const SESSION_KEY = "cvpilot_session_id";

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save state:", e);
  }
}

// ---------------------------------------------------------------------------
// Coverage tracking
//
// Instead of relying on the model to silently remember what it has covered
// across a long conversation, we maintain an explicit checklist in React
// state and re-inject it into the system prompt every single turn. The model
// updates that checklist by appending a hidden <!--TRACKING ... TRACKING-->
// block to its replies, which we parse out and strip before showing the
// message to the user.
// ---------------------------------------------------------------------------

const EMPTY_COVERAGE = {
  skillsCovered: {}, // { "React": "detailed" | "vague" | "no" }
  sectionsComplete: [], // subset of STAGE_ORDER
  currentSection: "personal",
};

const EMPTY_JD_SKILLS = {
  requiredSkills: [],
  niceToHave: [],
  yearsRequired: "",
  softSkills: [],
  keyResponsibilities: [],
};

function buildExtractionPrompt(jobData) {
  return `Extract structured requirements from this job description. Respond with ONLY raw JSON, no markdown fences, no commentary, exactly matching this shape:

{
  "requiredSkills": ["skill1", "skill2"],
  "niceToHave": ["skill1", "skill2"],
  "yearsRequired": "e.g. 3+ years",
  "softSkills": ["skill1", "skill2"],
  "keyResponsibilities": ["responsibility1", "responsibility2"]
}

Job title: ${jobData.jobTitle || "(not specified, infer from description)"}
Company: ${jobData.company || "(not specified, infer from description)"}

Description:
${jobData.jobDescription}`;
}

function buildSystemPrompt(jobData, jdSkills, coverage) {
  const title = jobData.jobTitle || "Extract from the job description";
  const company = jobData.company || "Extract from the job description";

  const skillChecklist = jdSkills.requiredSkills.length
    ? jdSkills.requiredSkills
        .map((skill) => {
          const status = coverage.skillsCovered[skill];
          const label =
            status === "detailed"
              ? "ASKED — got a detailed answer, do not ask again"
              : status === "vague"
              ? "ASKED — answer was vague, needs ONE follow-up then move on"
              : status === "no"
              ? "ASKED — candidate said no, do not ask again"
              : "NOT YET ASKED";
          return `- ${skill}: ${label}`;
        })
        .join("\n")
    : "(skills not yet extracted)";

  const sectionChecklist = STAGE_ORDER.map((s) => {
    const done = coverage.sectionsComplete.includes(s);
    const current = coverage.currentSection === s ? " <- YOU ARE HERE" : "";
    return `- ${s}: ${done ? "COMPLETE" : "not complete"}${current}`;
  }).join("\n");

  return `You are Pilot, an expert CV-building AI interviewer. You conduct a structured interview to extract EVERY detail needed for a job-tailored, ATS-friendly CV. You are thorough, specific, and never let vague answers slide.

## THE JOB DESCRIPTION
Title: ${title}
Company: ${company}

Full description:
${jobData.jobDescription}

## LIVE CHECKLIST — THIS IS YOUR SOURCE OF TRUTH, NOT YOUR MEMORY OF THE CHAT
Do not re-derive what's been covered from the conversation history. Use this checklist exactly as given below; it is kept up to date for you every turn.

### Required skills to cover:
${skillChecklist}

### Sections:
${sectionChecklist}

## RULES — FOLLOW THESE STRICTLY

1. ONE question at a time. Never bundle multiple questions.
2. NEVER invent or assume information. Only record what the candidate explicitly says.
3. Pick your next question by scanning the checklist above for the first "NOT YET ASKED" skill or "not complete" section — in that order: finish the current section's skills before moving to the next section. Do NOT ask generic catch-all questions ("tell me about your experience") while specific unasked skills remain on the checklist — ask about those skills by name instead.
4. NEVER accept vague answers. If they say "I worked on the frontend", always follow up with something concrete:
   - "What specific features did you build?"
   - "What framework or library did you use?"
   - "What was YOUR specific contribution?"
5. Do NOT repeat a question about a skill marked ASKED above, even if the conversation feels like it needs it — trust the checklist.
6. Do NOT end the interview early. All sections must show COMPLETE.
7. Be conversational and encouraging. Acknowledge good answers before moving on.
8. When asking about a skill, reference the JD: "This role specifically requires X..."

## AFTER EVERY REPLY — UPDATE THE CHECKLIST
At the very end of EVERY response (including the final one), append a hidden tracking block — the user never sees this, so do not reference it in your visible reply. Format exactly like this, valid JSON on one line:

<!--TRACKING{"skillsCovered":{"SkillName":"detailed|vague|no"},"sectionsComplete":["personal"],"currentSection":"experience"}TRACKING-->

Rules for this block:
- Only include skills/sections that changed or are newly known this turn; omit ones you haven't touched (they persist automatically).
- "detailed" = candidate gave a specific project/context. "vague" = they answered but with no specifics after one follow-up attempt. "no" = candidate doesn't have this skill.
- Mark a section "sectionsComplete" only once every question in that section has a real answer.
- currentSection must always be present and reflect where you're headed next.

## WHEN TO END THE INTERVIEW
End ONLY when every section on the checklist is COMPLETE and you have:
- Full name and at least email
- At least 1 work experience OR 1 detailed project
- 5+ technical skills with real context (not just names)
- Education details
- Enough detail to write strong, specific CV bullet points

When ending, say: "Thank you! I have everything I need. Your CV is being generated."

Then output the structured data on a new line exactly like this:

===CV_DATA===
{
  "personal": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "2-3 sentence professional summary tailored to this specific job, highlighting the candidate's most relevant experience and skills",
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "employmentType": "",
      "responsibilities": ["action verb + what they did + result if available"],
      "technologies": ["tech1", "tech2"]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "what the project does",
      "type": "personal/school/freelance",
      "technologies": ["tech1", "tech2"],
      "responsibilities": ["what the candidate specifically built"],
      "links": []
    }
  ],
  "education": [
    { "school": "", "degree": "", "field": "", "startDate": "", "endDate": "" }
  ],
  "skills": [
    { "name": "", "level": "beginner/intermediate/advanced" }
  ],
  "languages": [
    { "name": "", "level": "" }
  ],
  "certifications": [
    { "name": "", "issuer": "" }
  ]
}
===END_CV_DATA===

IMPORTANT: Write the CV data JSON exactly between ===CV_DATA=== and ===END_CV_DATA=== markers. Use ONLY information the candidate gave you. Make the professional summary specific to this job, not generic. Still include the <!--TRACKING...TRACKING--> block after the CV data on the final turn.`;
}

function parseCVData(text) {
  const match = text.match(/===CV_DATA===\s*([\s\S]*?)===END_CV_DATA===/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function parseTracking(text) {
  const match = text.match(/<!--TRACKING([\s\S]*?)TRACKING-->/);
  const cleanText = text.replace(/<!--TRACKING[\s\S]*?TRACKING-->/, "").replace(/===CV_DATA===[\s\S]*?===END_CV_DATA===/, "").trim();
  if (!match) return { tracking: null, cleanText: cleanText || text };
  try {
    const tracking = JSON.parse(match[1].trim());
    return { tracking, cleanText };
  } catch (e) {
    console.warn("Failed to parse tracking block:", e);
    return { tracking: null, cleanText };
  }
}

function mergeCoverage(prevCoverage, tracking) {
  if (!tracking) return prevCoverage;
  const skillsCovered = { ...prevCoverage.skillsCovered, ...(tracking.skillsCovered || {}) };
  const sectionsComplete = Array.from(
    new Set([...prevCoverage.sectionsComplete, ...(tracking.sectionsComplete || [])])
  );
  const currentSection = tracking.currentSection || prevCoverage.currentSection;
  return { skillsCovered, sectionsComplete, currentSection };
}

const EMPTY_PROFILE = {
  personal: {},
  summary: "",
  experience: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};

// ---------------------------------------------------------------------------
// Provider call — pulled out as a standalone function so both the
// conversational interview and the one-off JD extraction call can share it.
// ---------------------------------------------------------------------------

async function callProviderAPI(activeKey, systemContent, conversationMessages, { temperature = 0.4, maxTokens = 2048 } = {}) {
  let url, headers, body;

  const apiMessages = [{ role: "system", content: systemContent }, ...conversationMessages];

  if (activeKey.provider === "openai") {
    url = "https://api.openai.com/v1/chat/completions";
    headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
    body = { model: activeKey.model || "gpt-4o-mini", messages: apiMessages, temperature };
  } else if (activeKey.provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages";
    headers = { "Content-Type": "application/json", "x-api-key": activeKey.apiKey, "anthropic-version": "2023-06-01" };
    const system = apiMessages.shift();
    body = { model: activeKey.model || "claude-3-5-haiku-20241022", max_tokens: maxTokens, system: system.content, messages: apiMessages, temperature };
  } else if (activeKey.provider === "google") {
    const model = activeKey.model || "gemini-2.5-flash";
    url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    headers = { "Content-Type": "application/json", "x-goog-api-key": activeKey.apiKey };
    const contents = apiMessages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    const sysMsg = apiMessages.find((m) => m.role === "system");
    body = {
      contents,
      systemInstruction: sysMsg ? { parts: [{ text: sysMsg.content }] } : undefined,
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    };
  } else if (activeKey.provider === "openrouter") {
    url = "https://openrouter.ai/api/v1/chat/completions";
    headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}`, "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "" };
    body = { model: activeKey.model || "openrouter/free", messages: apiMessages, temperature };
  } else if (activeKey.provider === "nvidia") {
    url = "https://integrate.api.nvidia.com/v1/chat/completions";
    headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
    body = { model: activeKey.model || "meta/llama-3.1-70b-instruct", messages: apiMessages, temperature, max_tokens: maxTokens };
  } else if (activeKey.provider === "groq") {
    url = "https://api.groq.com/openai/v1/chat/completions";
    headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
    body = { model: activeKey.model || "llama-3.3-70b-versatile", messages: apiMessages, temperature };
  } else if (activeKey.provider === "deepseek") {
    url = "https://api.deepseek.com/chat/completions";
    headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
    body = { model: activeKey.model || "deepseek-chat", messages: apiMessages, temperature };
  } else if (activeKey.provider === "custom") {
    url = `${activeKey.endpoint}/chat/completions`;
    headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
    body = { model: activeKey.model || "default", messages: apiMessages, temperature };
  } else {
    throw new Error(`Unsupported provider: ${activeKey.provider}`);
  }

  console.log("[LLM Request]", { provider: activeKey.provider, url, model: body.model });

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json();

  console.log("[LLM Response]", { status: res.status, data });

  if (!res.ok) {
    const errMsg = data.error?.message || data.message || JSON.stringify(data);
    throw new Error(`API Error (${res.status}): ${errMsg}`);
  }

  if (activeKey.provider === "anthropic") {
    return data.content?.[0]?.text || "";
  } else if (activeKey.provider === "google") {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  return data.choices?.[0]?.message?.content || "";
}

export default function Home() {
  const saved = typeof window !== "undefined" ? loadState() : null;

  const [screen, setScreen] = useState(saved?.screen || "landing");
  const [llmKeys, setLlmKeys] = useState(saved?.llmKeys || []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jobData, setJobData] = useState(saved?.jobData || null);
  const [messages, setMessages] = useState(saved?.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState(saved?.activeSection || "personal");
  const [completedSections, setCompletedSections] = useState(saved?.completedSections || []);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(saved?.interviewComplete || false);
  const [profile, setProfile] = useState(saved?.profile || EMPTY_PROFILE);
  const [template, setTemplate] = useState(saved?.template || "classic");
  const [jdSkills, setJdSkills] = useState(saved?.jdSkills || EMPTY_JD_SKILLS);
  const [coverage, setCoverage] = useState(saved?.coverage || EMPTY_COVERAGE);

  const cvRef = useRef(null);
  const saveTimer = useRef(null);
  const sessionIdRef = useRef(null);
  const progress = (completedSections.length / STAGE_ORDER.length) * 100;

  // Initialize session ID
  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }
    sessionIdRef.current = id;
  }, []);

  // Debounced save to localStorage + backend
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const state = {
        screen,
        llmKeys,
        jobData,
        messages,
        activeSection,
        completedSections,
        profile,
        interviewComplete,
        template,
        jdSkills,
        coverage,
      };
      saveState(state);

      if (sessionIdRef.current && screen === "interview") {
        saveSession(sessionIdRef.current, {
          messages,
          profile,
          jobData,
          completedSections,
          activeSection,
          interviewComplete,
          jdSkills,
          coverage,
        });
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [screen, llmKeys, jobData, messages, activeSection, completedSections, profile, interviewComplete, template, jdSkills, coverage]);

  const handleDownloadPDF = useCallback(async () => {
    if (!profile.personal.name && !profile.summary && !profile.experience.length && !profile.projects.length) return;
    setGeneratingPDF(true);
    try {
      const name = profile.personal.name || "cv";
      const filename = `${name.replace(/\s+/g, "_")}_CV`;
      await generatePDF("cv-preview-content", filename, profile, jobData?.jobTitle, template);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  }, [profile]);

  // One-off call to extract a structured skill checklist from the JD before
  // the interview starts. This is what the system prompt's checklist is
  // seeded from, instead of asking the model to "silently analyze" the JD
  // fresh every single turn.
  const extractJDSkills = useCallback(
    async (data) => {
      const activeKey = llmKeys[0];
      if (!activeKey) return EMPTY_JD_SKILLS;

      try {
        const raw = await callProviderAPI(activeKey, "You are a precise JSON extraction tool. Output ONLY valid JSON, nothing else.", [
          { role: "user", content: buildExtractionPrompt(data) },
        ], { temperature: 0.1, maxTokens: 1024 });

        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
          requiredSkills: parsed.requiredSkills || [],
          niceToHave: parsed.niceToHave || [],
          yearsRequired: parsed.yearsRequired || "",
          softSkills: parsed.softSkills || [],
          keyResponsibilities: parsed.keyResponsibilities || [],
        };
      } catch (err) {
        console.error("[JD Extraction Error]", err);
        return EMPTY_JD_SKILLS;
      }
    },
    [llmKeys]
  );

  const callLLM = useCallback(
    async (conversationHistory) => {
      const activeKey = llmKeys[0];
      if (!activeKey) {
        return { text: "Please add an API key in Settings (gear icon top-right) to start the interview.", tracking: null };
      }

      const systemContent = buildSystemPrompt(jobData, jdSkills, coverage);

      try {
        const text = await callProviderAPI(
          activeKey,
          systemContent,
          conversationHistory.map((m) => ({ role: m.role, content: m.content })),
          { temperature: 0.4 }
        );

        const cvData = parseCVData(text);
        if (cvData) {
          setProfile((prev) => ({
            personal: cvData.personal || prev.personal,
            summary: cvData.summary || prev.summary,
            experience: cvData.experience?.length ? cvData.experience : prev.experience,
            projects: cvData.projects?.length ? cvData.projects : prev.projects,
            education: cvData.education?.length ? cvData.education : prev.education,
            skills: cvData.skills?.length ? cvData.skills : prev.skills,
            languages: cvData.languages?.length ? cvData.languages : prev.languages,
            certifications: cvData.certifications?.length ? cvData.certifications : prev.certifications,
          }));
          setCompletedSections([...STAGE_ORDER]);
          setActiveSection("summary");
          setInterviewComplete(true);
        }

        const { tracking, cleanText } = parseTracking(text);
        return { text: cleanText || text, tracking };
      } catch (err) {
        console.error("[LLM Error]", err);
        return { text: `Error: ${err.message}. Please check your API key and try again.`, tracking: null };
      }
    },
    [llmKeys, jobData, jdSkills, coverage]
  );

  const handleStartInterview = async (data) => {
    setJobData(data);
    setScreen("interview");
    setInterviewComplete(false);
    setCoverage(EMPTY_COVERAGE);

    const greeting = {
      role: "assistant",
      content: `I've analyzed the position${data.company ? ` at ${data.company}` : ""}. Let me walk you through what this role requires and then I'll ask you some targeted questions.\n\nTo start — what's your full name?`,
    };
    setMessages([greeting]);

    // Extract the skill checklist in the background so the very first real
    // question already has the full checklist to work from.
    const skills = await extractJDSkills(data);
    setJdSkills(skills);
  };

  const handleSendMessage = async (text) => {
    if (isTyping) return;
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    const { text: aiResponse, tracking } = await callLLM(newMessages);
    const aiMsg = { role: "assistant", content: aiResponse };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);

    setCoverage((prev) => {
      const next = mergeCoverage(prev, tracking);
      setCompletedSections(next.sectionsComplete);
      setActiveSection(next.currentSection);
      return next;
    });
  };

  const handleSaveKeys = (keys) => {
    setLlmKeys(keys);
  };

  const handleNewCV = () => {
    setScreen("landing");
    setMessages([]);
    setJobData(null);
    setCompletedSections([]);
    setActiveSection("personal");
    setProfile(EMPTY_PROFILE);
    setInterviewComplete(false);
    setJdSkills(EMPTY_JD_SKILLS);
    setCoverage(EMPTY_COVERAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed top-4 right-4 z-40 p-2.5 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all"
        title="API Settings"
      >
        <Settings size={18} className="text-navy" />
      </button>

      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        llmKeys={llmKeys}
        onSaveKeys={handleSaveKeys}
      />

      {screen === "landing" ? (
        <JobInput onSubmit={handleStartInterview} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar
            activeSection={activeSection}
            completedSections={completedSections}
            progress={progress}
            onDownload={handleDownloadPDF}
            onNewCV={handleNewCV}
            generatingPDF={generatingPDF}
          />

          {/* Chat Panel - smaller */}
          <div className="w-[380px] border-r border-border shrink-0 relative flex flex-col">
            {/* Interview Complete Banner */}
            {interviewComplete && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-teal-light border-b border-teal/20 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-teal" />
                  <span className="text-xs font-medium text-navy">CV ready! Download below.</span>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download size={12} />
                  {generatingPDF ? "..." : "PDF"}
                </button>
              </div>
            )}

            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              jobTitle={jobData?.jobTitle}
              isTyping={isTyping}
              interviewComplete={interviewComplete}
            />
          </div>

          {/* CV Preview - center, large */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Template Selector Bar */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-white shrink-0">
              <TemplateSelector selected={template} onSelect={setTemplate} />
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download size={14} />
                {generatingPDF ? "Generating..." : "Download PDF"}
              </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-hidden">
              <CvPreview ref={cvRef} profile={profile} jobTitle={jobData?.jobTitle} template={template} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}