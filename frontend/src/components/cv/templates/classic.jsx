"use client";

export default function ClassicTemplate({ profile, jobTitle }) {
  const personal = profile?.personal || {};
  const summary = profile?.summary || "";
  const experience = profile?.experience || [];
  const projects = profile?.projects || [];
  const education = profile?.education || [];
  const skills = profile?.skills || [];
  const languages = profile?.languages || [];
  const certifications = profile?.certifications || [];

  return (
    <div className="p-8 font-sans text-sm">
      {/* Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{personal.name || "Your Name"}</h1>

      {/* Contact */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-200">
        {personal.email && <span>{personal.email}</span>}
        {personal.phone && <span>{personal.email && "•"} {personal.phone}</span>}
        {personal.location && <span>{(personal.email || personal.phone) && "•"} {personal.location}</span>}
        {personal.linkedin && <span>{(personal.email || personal.phone || personal.location) && "•"} {personal.linkedin}</span>}
        {personal.github && <span>{(personal.email || personal.phone || personal.location || personal.linkedin) && "•"} {personal.github}</span>}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-900">{exp.role || "Role"}{exp.company && <span className="font-normal text-gray-500"> — {exp.company}</span>}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap">{exp.startDate || ""}{exp.endDate ? ` — ${exp.endDate}` : ""}</span>
              </div>
              {exp.responsibilities?.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {exp.responsibilities.map((r, j) => (
                    <li key={j} className="text-gray-700 flex gap-2">
                      <span className="text-gray-300">•</span>{r}
                    </li>
                  ))}
                </ul>
              )}
              {exp.technologies?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1 italic">{exp.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-gray-900">{proj.name || "Project"}{proj.type && <span className="font-normal text-gray-500"> ({proj.type})</span>}</p>
              {proj.description && <p className="text-gray-600 text-xs mt-0.5">{proj.description}</p>}
              {proj.technologies?.length > 0 && <p className="text-xs text-gray-400 italic">{proj.technologies.join(", ")}</p>}
              {proj.responsibilities?.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {proj.responsibilities.map((r, j) => (
                    <li key={j} className="text-gray-700 flex gap-2">
                      <span className="text-gray-300">•</span>{r}
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
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Skills</h2>
          <p className="text-gray-700">{skills.map((s) => s.name).join(" • ")}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Education</h2>
          {education.map((edu, i) => (
            <p key={i} className="text-gray-700">
              <span className="font-semibold">{edu.degree || "Degree"}{edu.field ? ` — ${edu.field}` : ""}</span>
              {edu.school && <span>, {edu.school}</span>}
              {edu.startDate && <span className="text-gray-400"> ({edu.startDate} — {edu.endDate || "Present"})</span>}
            </p>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Languages</h2>
          <p className="text-gray-700">{languages.map((l) => l.level ? `${l.name} (${l.level})` : l.name).join(" • ")}</p>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Certifications</h2>
          {certifications.map((c, i) => (
            <p key={i} className="text-gray-700">{c.name}{c.issuer && ` — ${c.issuer}`}</p>
          ))}
        </div>
      )}
    </div>
  );
}
