"use client";

import { forwardRef } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

const CvPreview = forwardRef(function CvPreview({ profile, jobTitle }, ref) {
  const personal = profile?.personal || {};
  const experience = profile?.experience || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const skills = profile?.skills || [];
  const languages = profile?.languages || [];
  const certifications = profile?.certifications || [];
  const summary = profile?.summary || "";

  const hasContent = summary || experience.length || projects.length || skills.length || education.length;

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
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
        <div
          ref={ref}
          id="cv-preview-content"
          className="bg-white rounded-xl shadow-sm border border-border max-w-2xl mx-auto"
        >
          <div className="p-8">
            {/* Name */}
            <h1 className="text-3xl font-bold text-navy mb-1">
              {personal.name || "Your Name"}
            </h1>

            {/* Contact */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && (
                <>
                  {personal.email && <span className="text-border">•</span>}
                  <span>{personal.phone}</span>
                </>
              )}
              {personal.location && (
                <>
                  {(personal.email || personal.phone) && <span className="text-border">•</span>}
                  <span>{personal.location}</span>
                </>
              )}
              {personal.linkedin && (
                <>
                  {(personal.email || personal.phone || personal.location) && <span className="text-border">•</span>}
                  <span>{personal.linkedin}</span>
                </>
              )}
              {personal.github && (
                <>
                  {(personal.email || personal.phone || personal.location || personal.linkedin) && <span className="text-border">•</span>}
                  <span>{personal.github}</span>
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
                  Experience
                </h2>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-foreground text-sm">
                        {exp.role || "Role"}
                        {exp.company && (
                          <span className="text-navy-muted font-normal"> — {exp.company}</span>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {exp.startDate || ""}{exp.endDate ? ` — ${exp.endDate}` : ""}
                      </span>
                    </div>
                    {exp.responsibilities?.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {exp.responsibilities.map((r, j) => (
                          <li key={j} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-teal mt-1.5 shrink-0">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies?.length > 0 && (
                      <p className="text-xs text-navy-muted mt-1.5 italic">
                        {exp.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                  Projects
                </h2>
                {projects.map((proj, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <p className="font-semibold text-foreground text-sm">
                      {proj.name || "Project"}
                      {proj.type && (
                        <span className="text-navy-muted font-normal"> ({proj.type})</span>
                      )}
                    </p>
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
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {proj.links?.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {proj.links.join(" | ")}
                      </p>
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
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-teal-light text-navy text-xs font-medium rounded-md"
                    >
                      {skill.name}
                      {skill.level && (
                        <span className="text-navy-muted font-normal ml-1">· {skill.level}</span>
                      )}
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
                      {edu.degree || "Degree"}{edu.field ? ` — ${edu.field}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.school || "School"}
                      {edu.startDate && ` • ${edu.startDate} — ${edu.endDate || "Present"}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-2">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, i) => (
                    <span key={i} className="text-sm text-foreground">
                      {lang.name}{lang.level ? ` (${lang.level})` : ""}
                      {i < languages.length - 1 && <span className="text-border ml-2">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-navy tracking-wider uppercase mb-2">
                  Certifications
                </h2>
                {certifications.map((cert, i) => (
                  <p key={i} className="text-sm text-foreground">
                    {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}
                  </p>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!hasContent && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">Your CV will appear here as you chat with the AI.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CvPreview;
