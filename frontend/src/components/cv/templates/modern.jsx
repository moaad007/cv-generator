"use client";

export default function ModernTemplate({ profile, jobTitle }) {
  const personal = profile?.personal || {};
  const summary = profile?.summary || "";
  const experience = profile?.experience || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const skills = profile?.skills || [];
  const languages = profile?.languages || [];
  const certifications = profile?.certifications || [];

  return (
    <div className="flex font-sans text-sm min-h-[1122px]">
      {/* Left Sidebar */}
      <div className="w-[240px] bg-[#1a1f36] text-white p-6 shrink-0">
        {/* Name */}
        <h1 className="text-xl font-bold mb-1">{personal.name || "Your Name"}</h1>
        {jobTitle && <p className="text-xs text-white/60 mb-4">{jobTitle}</p>}

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/50">Contact</h3>
          <div className="space-y-1 text-xs text-white/80">
            {personal.email && <p>{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.location && <p>{personal.location}</p>}
            {personal.linkedin && <p className="truncate">{personal.linkedin}</p>}
            {personal.github && <p className="truncate">{personal.github}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/50">Skills</h3>
            <div className="space-y-1.5">
              {skills.map((s, i) => (
                <div key={i}>
                  <p className="text-xs text-white/90">{s.name}</p>
                  {s.level && (
                    <div className="w-full h-1 bg-white/10 rounded-full mt-0.5">
                      <div
                        className="h-full bg-[#46B5D1] rounded-full"
                        style={{ width: s.level === "advanced" ? "90%" : s.level === "intermediate" ? "65%" : "40%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/50">Languages</h3>
            <div className="space-y-1 text-xs text-white/80">
              {languages.map((l, i) => (
                <p key={i}>{l.name}{l.level && ` — ${l.level}`}</p>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/50">Education</h3>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="text-xs font-semibold text-white">{edu.degree || "Degree"}{edu.field && ` — ${edu.field}`}</p>
                <p className="text-xs text-white/60">{edu.school}</p>
                {edu.startDate && <p className="text-xs text-white/40">{edu.startDate} — {edu.endDate || "Present"}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/50">Certifications</h3>
            {certifications.map((c, i) => (
              <p key={i} className="text-xs text-white/80">{c.name}</p>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {summary && (
          <div className="mb-5">
            <h2 className="text-xs font-bold text-[#1a1f36] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#46B5D1] rounded-full" />
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-xs">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold text-[#1a1f36] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#46B5D1] rounded-full" />
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-gray-900 text-xs">{exp.role || "Role"}{exp.company && <span className="font-normal text-gray-500"> — {exp.company}</span>}</p>
                  <span className="text-[10px] text-gray-400">{exp.startDate || ""}{exp.endDate ? ` — ${exp.endDate}` : ""}</span>
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} className="text-gray-700 text-xs flex gap-2">
                        <span className="text-[#46B5D1]">•</span>{r}
                      </li>
                    ))}
                  </ul>
                )}
                {exp.technologies?.length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1 italic">{exp.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold text-[#1a1f36] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#46B5D1] rounded-full" />
              Projects
            </h2>
            {projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold text-gray-900 text-xs">{proj.name || "Project"}{proj.type && <span className="font-normal text-gray-500"> ({proj.type})</span>}</p>
                {proj.description && <p className="text-gray-600 text-xs mt-0.5">{proj.description}</p>}
                {proj.technologies?.length > 0 && <p className="text-[10px] text-gray-400 italic">{proj.technologies.join(", ")}</p>}
                {proj.responsibilities?.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.responsibilities.map((r, j) => (
                      <li key={j} className="text-gray-700 text-xs flex gap-2">
                        <span className="text-[#46B5D1]">•</span>{r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
