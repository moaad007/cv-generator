"use client";

export default function TechnicalTemplate({ profile, jobTitle }) {
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
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Name & Title */}
        <h1 className="text-2xl font-bold text-gray-900">{personal.name || "Your Name"}</h1>
        {jobTitle && <p className="text-xs text-[#151965] font-medium mb-2">{jobTitle}</p>}

        {/* Contact Row */}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500 mb-5 pb-4 border-b border-gray-200">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.email && "•"} {personal.phone}</span>}
          {personal.location && <span>{(personal.email || personal.phone) && "•"} {personal.location}</span>}
          {personal.linkedin && <span>{(personal.email || personal.phone || personal.location) && "•"} {personal.linkedin}</span>}
          {personal.github && <span>{(personal.email || personal.phone || personal.location || personal.linkedin) && "•"} {personal.github}</span>}
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-1.5">Summary</h2>
            <p className="text-gray-700 leading-relaxed text-xs">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-2">Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-3 pl-3 border-l-2 border-[#46B5D1]">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-gray-900 text-xs">{exp.role || "Role"}{exp.company && <span className="font-normal text-gray-500"> — {exp.company}</span>}</p>
                  <span className="text-[10px] text-gray-400">{exp.startDate || ""}{exp.endDate ? ` — ${exp.endDate}` : ""}</span>
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} className="text-gray-700 text-xs flex gap-2">
                        <span className="text-[#46B5D1]">▸</span>{r}
                      </li>
                    ))}
                  </ul>
                )}
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {exp.technologies.map((t, j) => (
                      <span key={j} className="px-1.5 py-0.5 bg-[#151965]/5 text-[10px] text-[#151965] rounded font-medium">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-2">Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} className="mb-3 pl-3 border-l-2 border-[#46B5D1]">
                <p className="font-semibold text-gray-900 text-xs">{proj.name || "Project"}{proj.type && <span className="font-normal text-gray-500"> ({proj.type})</span>}</p>
                {proj.description && <p className="text-gray-600 text-xs mt-0.5">{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, j) => (
                      <span key={j} className="px-1.5 py-0.5 bg-[#151965]/5 text-[10px] text-[#151965] rounded font-medium">{t}</span>
                    ))}
                  </div>
                )}
                {proj.responsibilities?.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.responsibilities.map((r, j) => (
                      <li key={j} className="text-gray-700 text-xs flex gap-2">
                        <span className="text-[#46B5D1]">▸</span>{r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-2">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="pl-3 border-l-2 border-[#46B5D1] mb-2">
                <p className="font-semibold text-gray-900 text-xs">{edu.degree || "Degree"}{edu.field && ` — ${edu.field}`}</p>
                <p className="text-gray-500 text-xs">{edu.school}{edu.startDate && ` (${edu.startDate} — ${edu.endDate || "Present"})`}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-[200px] bg-gray-50 border-l border-gray-200 p-5 shrink-0">
        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-2">Skills</h3>
            <div className="space-y-1.5">
              {skills.map((s, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-700 font-medium">{s.name}</p>
                  {s.level && <p className="text-[10px] text-gray-400 capitalize">{s.level}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-5">
            <h3 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-2">Languages</h3>
            <div className="space-y-1 text-xs text-gray-700">
              {languages.map((l, i) => (
                <p key={i}>{l.name}{l.level && <span className="text-gray-400"> · {l.level}</span>}</p>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-[#151965] uppercase tracking-wider mb-2">Certifications</h3>
            {certifications.map((c, i) => (
              <div key={i} className="mb-1.5">
                <p className="text-xs text-gray-700 font-medium">{c.name}</p>
                {c.issuer && <p className="text-[10px] text-gray-400">{c.issuer}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
