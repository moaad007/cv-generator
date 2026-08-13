"use client";

import { Eye, ZoomIn, ZoomOut } from "lucide-react";

export default function CvPreview({ profile, jobTitle }) {
  const personal = profile?.personal || {};
  const experience = profile?.experience || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const skills = profile?.skills || [];
  const summary = profile?.summary || "";

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
          <span className="text-sm font-medium text-navy">Live Preview</span>
          <span className="text-xs text-muted-foreground">— Updates as you chat</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ZoomOut size={16} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ZoomIn size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* CV Preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-border max-w-2xl mx-auto">
          {/* CV Content */}
          <div className="p-8">
            {/* Name & Title */}
            <h1 className="text-3xl font-bold text-navy mb-1">
              {personal.name || "Your Name"}
            </h1>
            <p className="text-lg text-navy-muted font-medium mb-4">
              {jobTitle || "Job Title"}
            </p>

            {/* Contact */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              {personal.email && <span>{personal.email}</span>}
              {personal.email && personal.github && <span>•</span>}
              {personal.github && <span>{personal.github}</span>}
              {(personal.email || personal.github) && personal.linkedin && <span>•</span>}
              {personal.linkedin && <span>{personal.linkedin}</span>}
              {personal.phone && (
                <>
                  {(personal.email || personal.github || personal.linkedin) && <span>•</span>}
                  <span>{personal.phone}</span>
                </>
              )}
              {personal.location && (
                <>
                  {(personal.email || personal.github || personal.linkedin || personal.phone) && <span>•</span>}
                  <span>{personal.location}</span>
                </>
              )}
            </div>

            {/* Summary */}
            {summary && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm text-foreground leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                  Experience & Projects
                </h2>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {exp.role || "Role"}
                          {exp.company && (
                            <span className="text-navy-muted font-normal"> ({exp.company})</span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {exp.startDate || "Start"} - {exp.endDate || "Present"}
                      </span>
                    </div>
                    {exp.responsibilities?.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {exp.responsibilities.map((r, j) => (
                          <li key={j} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-teal mt-1.5 shrink-0">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && experience.length === 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                  Projects
                </h2>
                {projects.map((proj, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <p className="font-semibold text-foreground text-sm">{proj.name || "Project"}</p>
                    {proj.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{proj.description}</p>
                    )}
                    {proj.technologies?.length > 0 && (
                      <p className="text-xs text-navy-muted mt-1 italic">
                        {proj.technologies.join(", ")}
                      </p>
                    )}
                    {proj.responsibilities?.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {proj.responsibilities.map((r, j) => (
                          <li key={j} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-teal mt-1.5 shrink-0">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-teal-light text-navy text-xs font-medium rounded-md"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-2">
                  Education
                </h2>
                {education.map((edu, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <p className="font-semibold text-foreground text-sm">
                      {edu.degree || "Degree"} {edu.field && `- ${edu.field}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.school || "School"}
                      {edu.startDate && ` • ${edu.startDate} - ${edu.endDate || "Present"}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!summary && experience.length === 0 && projects.length === 0 && skills.length === 0 && education.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Your CV will appear here as you chat with the AI.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
