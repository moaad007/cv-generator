"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Settings, CheckCircle, Download } from "lucide-react";
import Sidebar from "@/components/cv/sidebar";
import ChatPanel from "@/components/cv/chat-panel";
import CvPreview from "@/components/cv/cv-preview";
import JobInput from "@/components/cv/job-input";
import SettingsDialog from "@/components/cv/settings-dialog";
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

function buildSystemPrompt(jobData) {
  const jd = jobData.jobDescription;
  const title = jobData.jobTitle || "Extract from the job description";
  const company = jobData.company || "Extract from the job description";

  return `You are Pilot, an expert CV-building AI interviewer. You conduct a structured interview to extract EVERY detail needed for a job-tailored, ATS-friendly CV. You are thorough, specific, and never let vague answers slide.

## THE JOB DESCRIPTION
Title: ${title}
Company: ${company}

Full description:
${jd}

## STEP 1 — ANALYZE THE JOB (do this silently before asking anything)
Break the JD into:
- Required technical skills (list each one)
- Preferred/nice-to-have skills
- Years of experience required
- Soft skills mentioned
- Key responsibilities
- Education requirements

You will use this list to drive your questions.

## STEP 2 — INTERVIEW SECTIONS (go through IN ORDER, do not skip)

### A. Personal Info (1-2 questions)
- "What's your full name?"
- "What email and phone number should appear on your CV?"
- "Where are you located (city, country)?"
- "Do you have a LinkedIn or GitHub/portfolio URL you'd like included?"

### B. Technical Skills (2-4 questions, one per key JD skill)
For EACH required skill in the JD, ask directly:
- "The job requires ${title} experience with [SKILL]. Have you used [SKILL]? In what context and on what projects?"
If they say yes, follow up:
- "Can you describe a specific project where you used [SKILL]? What was your role and what did you personally do?"
If they say no, move on. Do not push.

Also ask about relevant skills NOT in the JD if they came up in their background.

### C. Work Experience (3-5 questions)
- "Have you worked professionally in a role related to ${title}? Tell me about your most relevant position."
For EACH role they mention, dig into:
- Company name
- Job title
- Start and end dates (month/year)
- Employment type (full-time, part-time, internship, freelance)
- "What were your main responsibilities?"
- "What did YOU personally build, ship, or accomplish? (Not the team — you specifically)"
- "What technologies and tools did you use daily?"
- "Did you receive any recognition, awards, or measurable results?"

### D. Projects (2-3 questions)
- "Do you have any personal, freelance, open-source, or school projects relevant to this role?"
For EACH project:
- Project name
- "What does this project do? What problem does it solve?"
- "What technologies did you use?"
- "What did YOU personally build? Describe your specific contributions."
- "Is there a live URL or GitHub repo?"

### E. Education (1-2 questions)
- "What's your highest level of education? Degree, field of study, school name, and dates."
- "Any relevant coursework, thesis, or academic projects?"

### F. Certifications & Extras (1-2 questions)
- "Do you have any certifications, awards, or notable achievements?"
- "What languages do you speak?"
- "Anything else you'd like to highlight on your CV?"

## RULES — FOLLOW THESE STRICTLY

1. ONE question at a time. Never bundle multiple questions.
2. NEVER invent or assume information. Only record what the candidate explicitly says.
3. NEVER accept vague answers. If they say "I worked on the frontend", always follow up:
   - "What specific features did you build?"
   - "What framework or library did you use?"
   - "What was YOUR specific contribution?"
4. Do NOT repeat questions. Track what has been covered.
5. Do NOT end the interview early. You MUST cover all 6 sections above.
6. If a section has weak or missing answers, ask more questions in that section.
7. Be conversational and encouraging. Acknowledge good answers before moving on.
8. When asking about a skill, reference the JD: "This role specifically requires X..."
9. After the candidate answers, briefly note what you learned, then move to the next question.

## WHEN TO END THE INTERVIEW
End ONLY when you have:
- [ ] Full name and at least email
- [ ] At least 1 work experience OR 1 detailed project
- [ ] 5+ technical skills with context (not just names)
- [ ] Education details
- [ ] Enough detail to write strong, specific CV bullet points

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

IMPORTANT: Write the CV data JSON exactly between ===CV_DATA=== and ===END_CV_DATA=== markers. Use ONLY information the candidate gave you. Make the professional summary specific to this job, not generic.`;
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
        });
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [screen, llmKeys, jobData, messages, activeSection, completedSections, profile, interviewComplete]);

  const handleDownloadPDF = useCallback(async () => {
    if (!profile.personal.name && !profile.summary && !profile.experience.length && !profile.projects.length) return;
    setGeneratingPDF(true);
    try {
      const name = profile.personal.name || "cv";
      const filename = `${name.replace(/\s+/g, "_")}_CV`;
      await generatePDF("cv-preview-content", filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  }, [profile]);

  const callLLM = useCallback(
    async (conversationHistory) => {
      const activeKey = llmKeys[0];
      if (!activeKey) {
        return "Please add an API key in Settings (gear icon top-right) to start the interview.";
      }

      const systemMsg = { role: "system", content: buildSystemPrompt(jobData) };
      const apiMessages = [systemMsg, ...conversationHistory.map((m) => ({ role: m.role, content: m.content }))];

      try {
        let url, headers, body;

        if (activeKey.provider === "openai") {
          url = "https://api.openai.com/v1/chat/completions";
          headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
          body = { model: activeKey.model || "gpt-4o-mini", messages: apiMessages, temperature: 0.7 };
        } else if (activeKey.provider === "anthropic") {
          url = "https://api.anthropic.com/v1/messages";
          headers = { "Content-Type": "application/json", "x-api-key": activeKey.apiKey, "anthropic-version": "2023-06-01" };
          const system = apiMessages.shift();
          body = { model: activeKey.model || "claude-3-5-haiku-20241022", max_tokens: 2048, system: system.content, messages: apiMessages };
        } else if (activeKey.provider === "google") {
          const model = activeKey.model || "gemini-3.5-flash";
          url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
          headers = { "Content-Type": "application/json", "x-goog-api-key": activeKey.apiKey };
          const contents = apiMessages
            .filter((m) => m.role !== "system")
            .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
          const sysMsg = apiMessages.find((m) => m.role === "system");
          body = {
            contents,
            systemInstruction: sysMsg ? { parts: [{ text: sysMsg.content }] } : undefined,
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          };
        } else if (activeKey.provider === "openrouter") {
          url = "https://openrouter.ai/api/v1/chat/completions";
          headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}`, "HTTP-Referer": window.location.origin };
          body = { model: activeKey.model || "openrouter/free", messages: apiMessages, temperature: 0.7 };
        } else if (activeKey.provider === "nvidia") {
          url = "https://integrate.api.nvidia.com/v1/chat/completions";
          headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
          body = { model: activeKey.model || "meta/llama-3.1-70b-instruct", messages: apiMessages, temperature: 0.7, max_tokens: 2048 };
        } else if (activeKey.provider === "groq") {
          url = "https://api.groq.com/openai/v1/chat/completions";
          headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
          body = { model: activeKey.model || "llama-3.3-70b-versatile", messages: apiMessages, temperature: 0.7 };
        } else if (activeKey.provider === "deepseek") {
          url = "https://api.deepseek.com/chat/completions";
          headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
          body = { model: activeKey.model || "deepseek-chat", messages: apiMessages, temperature: 0.7 };
        } else if (activeKey.provider === "custom") {
          url = `${activeKey.endpoint}/chat/completions`;
          headers = { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.apiKey}` };
          body = { model: activeKey.model || "default", messages: apiMessages, temperature: 0.7 };
        }

        console.log("[LLM Request]", { provider: activeKey.provider, url, model: body.model });

        const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
        const data = await res.json();

        console.log("[LLM Response]", { status: res.status, data });

        if (!res.ok) {
          const errMsg = data.error?.message || data.message || JSON.stringify(data);
          return `API Error (${res.status}): ${errMsg}`;
        }

        let text = "";
        if (activeKey.provider === "anthropic") {
          text = data.content?.[0]?.text || "";
        } else if (activeKey.provider === "google") {
          text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else {
          text = data.choices?.[0]?.message?.content || "";
        }

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

        const cleanText = text.replace(/===CV_DATA===[\s\S]*?===END_CV_DATA===/, "").trim();
        return cleanText || text;
      } catch (err) {
        console.error("[LLM Error]", err);
        return `Error: ${err.message}. Please check your API key and try again.`;
      }
    },
    [llmKeys, jobData]
  );

  const handleStartInterview = async (data) => {
    setJobData(data);
    setScreen("interview");
    setInterviewComplete(false);

    const greeting = {
      role: "assistant",
      content: `I've analyzed the position${data.company ? ` at ${data.company}` : ""}. Let me walk you through what this role requires and then I'll ask you some targeted questions.\n\nTo start — what's your full name?`,
    };
    setMessages([greeting]);
  };

  const handleSendMessage = async (text) => {
    if (isTyping) return;
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    const aiResponse = await callLLM(newMessages);
    const aiMsg = { role: "assistant", content: aiResponse };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);

    if (aiResponse.includes("===CV_DATA===")) {
      setInterviewComplete(true);
    } else {
      const lower = text.toLowerCase();
      const newCompleted = [...completedSections];

      if (lower.match(/\b(name|i'm|my name|i am)\b/) && !profile.personal.name) {
        const nameMatch = text.match(/(?:I'm|My name is|I am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
        if (nameMatch) {
          setProfile((p) => ({ ...p, personal: { ...p.personal, name: nameMatch[1] } }));
          if (!newCompleted.includes("personal")) newCompleted.push("personal");
        }
      }

      if (lower.match(/\b(email|@)\b/) && !profile.personal.email) {
        const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
        if (emailMatch) {
          setProfile((p) => ({ ...p, personal: { ...p.personal, email: emailMatch[0] } }));
          if (!newCompleted.includes("personal")) newCompleted.push("personal");
        }
      }

      if (lower.match(/\b(github|git hub)\b/) && !profile.personal.github) {
        const ghMatch = text.match(/github\.com\/[\w-]+/i) || text.match(/[\w-]+$/);
        if (ghMatch) {
          setProfile((p) => ({
            ...p,
            personal: { ...p.personal, github: ghMatch[0].startsWith("http") ? ghMatch[0] : `github.com/${ghMatch[0]}` },
          }));
        }
      }

      if (lower.match(/\b(react|next\.?js|vue|angular|typescript|javascript|node\.?js|python|java|sql|docker|aws|git|html|css)\b/)) {
        const techMap = {
          react: "React", "next.js": "Next.js", vue: "Vue.js", angular: "Angular",
          typescript: "TypeScript", javascript: "JavaScript", "node.js": "Node.js",
          python: "Python", java: "Java", sql: "SQL", docker: "Docker", aws: "AWS",
          git: "Git", html: "HTML", css: "CSS",
        };
        const techs = Object.entries(techMap).filter(([k]) => lower.includes(k)).map(([, v]) => v);
        if (techs.length) {
          setProfile((p) => {
            const existing = p.skills.map((s) => s.name);
            const newTechs = techs.filter((t) => !existing.includes(t)).map((t) => ({ name: t }));
            return { ...p, skills: [...p.skills, ...newTechs] };
          });
          if (!newCompleted.includes("skills")) newCompleted.push("skills");
        }
      }

      if (lower.match(/\b(degree|bachelor|master|university|college|studied|graduated)\b/)) {
        if (!newCompleted.includes("education")) newCompleted.push("education");
      }

      if (lower.match(/\b(internship|intern|worked at|employed|job at|position at|company)\b/)) {
        if (!newCompleted.includes("experience")) newCompleted.push("experience");
      }

      setCompletedSections(newCompleted);
      setActiveSection(newCompleted[newCompleted.length - 1] || "personal");
    }
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
          <Sidebar
            activeSection={activeSection}
            completedSections={completedSections}
            progress={progress}
            onDownload={handleDownloadPDF}
            onNewCV={handleNewCV}
            generatingPDF={generatingPDF}
          />

          <div className="flex-1 min-w-0 relative">
            {/* Interview Complete Banner */}
            {interviewComplete && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-teal-light border-b border-teal/20 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-teal" />
                  <span className="text-sm font-medium text-navy">Your CV is ready! Review it on the right, then download as PDF.</span>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download size={14} />
                  {generatingPDF ? "Generating..." : "Download PDF"}
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

          <div className="w-[420px] border-l border-border shrink-0 hidden lg:block">
            <CvPreview ref={cvRef} profile={profile} jobTitle={jobData?.jobTitle} />
          </div>
        </div>
      )}
    </div>
  );
}
