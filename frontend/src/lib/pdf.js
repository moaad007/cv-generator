import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function getContactLine(p) {
  return [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(" • ");
}

function bullet(text) {
  return `<li style="margin:2px 0;padding-left:8px;position:relative;font-size:12px;color:#374151"><span style="position:absolute;left:0;color:#46B5D1">•</span>${text}</li>`;
}

function bulletDark(text) {
  return `<li style="margin:2px 0;padding-left:8px;position:relative;font-size:12px;color:#e5e7eb"><span style="position:absolute;left:0;color:#46B5D1">▸</span>${text}</li>`;
}

function expBlock(e, bulletFn) {
  return `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <p style="font-size:12px;font-weight:600;margin:0">${e.role || "Role"}${e.company ? `<span style="font-weight:400;color:#6b7280"> — ${e.company}</span>` : ""}</p>
        <span style="font-size:10px;color:#9ca3af;white-space:nowrap">${e.startDate || ""}${e.endDate ? ` — ${e.endDate}` : ""}</span>
      </div>
      ${e.responsibilities?.length ? `<ul style="list-style:none;padding:0;margin:4px 0 0">${e.responsibilities.map(bulletFn).join("")}</ul>` : ""}
      ${e.technologies?.length ? `<p style="font-size:10px;color:#9ca3af;margin:4px 0 0;font-style:italic">${e.technologies.join(", ")}</p>` : ""}
    </div>`;
}

function projBlock(pr, bulletFn) {
  return `
    <div style="margin-bottom:10px">
      <p style="font-size:12px;font-weight:600;margin:0">${pr.name || "Project"}${pr.type ? `<span style="font-weight:400;color:#6b7280"> (${pr.type})</span>` : ""}</p>
      ${pr.description ? `<p style="font-size:11px;color:#6b7280;margin:2px 0 0">${pr.description}</p>` : ""}
      ${pr.technologies?.length ? `<p style="font-size:10px;color:#9ca3af;margin:2px 0 0;font-style:italic">${pr.technologies.join(", ")}</p>` : ""}
      ${pr.responsibilities?.length ? `<ul style="list-style:none;padding:0;margin:4px 0 0">${pr.responsibilities.map(bulletFn).join("")}</ul>` : ""}
    </div>`;
}

function section(title, content) {
  return `<div style="margin-bottom:16px">
    <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:8px">${title}</h2>
    ${content}
  </div>`;
}

function sectionDark(title, content) {
  return `<div style="margin-bottom:16px">
    <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:8px">${title}</h2>
    ${content}
  </div>`;
}

function skillsHTML(skills) {
  return `<p style="font-size:12px;color:#374151;margin:0">${skills.map(s => s.name).join(" • ")}</p>`;
}

function skillsHTMLSidebar(skills) {
  return skills.map(s => `
    <div style="margin-bottom:6px">
      <p style="font-size:11px;color:#e5e7eb;margin:0">${s.name}</p>
      ${s.level ? `<div style="width:100%;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;margin-top:2px">
        <div style="height:100%;background:#46B5D1;border-radius:2px;width:${s.level === "advanced" ? "90%" : s.level === "intermediate" ? "65%" : "40%"}"></div>
      </div>` : ""}
    </div>`).join("");
}

function skillsHTMLTags(skills) {
  return `<div style="display:flex;flex-wrap:wrap;gap:4px">${skills.map(s => `<span style="padding:2px 6px;background:#15196510;color:#151965;font-size:10px;border-radius:3px;font-weight:500">${s.name}</span>`).join("")}</div>`;
}

function langsHTML(langs) {
  return `<p style="font-size:12px;color:#374151;margin:0">${langs.map(l => l.level ? `${l.name} (${l.level})` : l.name).join(" • ")}</p>`;
}

function langsHTMLSidebar(langs) {
  return langs.map(l => `<p style="font-size:11px;color:#e5e7eb;margin:2px 0">${l.name}${l.level ? ` — ${l.level}` : ""}</p>`).join("");
}

function langsHTMLTags(langs) {
  return `<div style="display:flex;flex-wrap:wrap;gap:8px">${langs.map(l => `<span style="font-size:11px;color:#374151">${l.name}${l.level ? ` · ${l.level}` : ""}</span>`).join("")}</div>`;
}

function certsHTML(certs) {
  return certs.map(c => `<p style="font-size:12px;color:#374151;margin:2px 0">${c.name}${c.issuer ? ` — ${c.issuer}` : ""}</p>`).join("");
}

function certsHTMLSidebar(certs) {
  return certs.map(c => `<p style="font-size:11px;color:#e5e7eb;margin:2px 0">${c.name}${c.issuer ? ` — ${c.issuer}` : ""}</p>`).join("");
}

function certsHTMLTags(certs) {
  return certs.map(c => `<div style="margin-bottom:4px"><p style="font-size:11px;color:#374151;margin:0;font-weight:500">${c.name}</p>${c.issuer ? `<p style="font-size:10px;color:#9ca3af;margin:0">${c.issuer}</p>` : ""}</div>`).join("");
}

// ---- CLASSIC (single column) ----
function renderClassic(profile, jobTitle) {
  const p = profile?.personal || {};
  const contact = getContactLine(p);

  let html = `<div style="font-family:system-ui,-apple-system,sans-serif;padding:32px;color:#111827">
    <h1 style="font-size:24px;font-weight:700;margin:0 0 4px">${p.name || "Your Name"}</h1>
    ${jobTitle ? `<p style="font-size:13px;color:#151965;font-weight:500;margin:0 0 12px">${jobTitle}</p>` : ""}
    ${contact ? `<p style="font-size:11px;color:#6b7280;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #e5e7eb">${contact}</p>` : ""}`;

  if (profile?.summary) html += section("Professional Summary", `<p style="font-size:12px;color:#374151;line-height:1.6;margin:0">${profile.summary}</p>`);
  if (profile?.experience?.length) html += section("Experience", profile.experience.map(e => expBlock(e, bullet)).join(""));
  if (profile?.projects?.length) html += section("Projects", profile.projects.map(pr => projBlock(pr, bullet)).join(""));
  if (profile?.skills?.length) html += section("Skills", skillsHTML(profile.skills));
  if (profile?.education?.length) html += section("Education", profile.education.map(e => `<p style="font-size:12px;color:#374151;margin:2px 0"><span style="font-weight:600">${e.degree || "Degree"}${e.field ? ` — ${e.field}` : ""}</span>${e.school ? `, ${e.school}` : ""}${e.startDate ? ` <span style="color:#9ca3af">(${e.startDate} — ${e.endDate || "Present"})</span>` : ""}</p>`).join(""));
  if (profile?.languages?.length) html += section("Languages", langsHTML(profile.languages));
  if (profile?.certifications?.length) html += section("Certifications", certsHTML(profile.certifications));

  html += `</div>`;
  return html;
}

// ---- MODERN (dark sidebar) ----
function renderModern(profile, jobTitle) {
  const p = profile?.personal || {};
  const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;display:flex;color:#111827;min-height:1122px">
      <!-- Sidebar -->
      <div style="width:220px;background:#1a1f36;color:#fff;padding:24px;flex-shrink:0">
        <h1 style="font-size:18px;font-weight:700;margin:0 0 4px">${p.name || "Your Name"}</h1>
        ${jobTitle ? `<p style="font-size:10px;color:rgba(255,255,255,0.5);margin:0 0 16px">${jobTitle}</p>` : ""}

        ${contactParts.length ? `<div style="margin-bottom:20px">
          <h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.4);margin:0 0 8px">Contact</h3>
          ${contactParts.map(c => `<p style="font-size:10px;color:rgba(255,255,255,0.7);margin:2px 0">${c}</p>`).join("")}
        </div>` : ""}

        ${profile?.skills?.length ? `<div style="margin-bottom:20px">
          <h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.4);margin:0 0 8px">Skills</h3>
          ${skillsHTMLSidebar(profile.skills)}
        </div>` : ""}

        ${profile?.languages?.length ? `<div style="margin-bottom:20px">
          <h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.4);margin:0 0 8px">Languages</h3>
          ${langsHTMLSidebar(profile.languages)}
        </div>` : ""}

        ${profile?.education?.length ? `<div style="margin-bottom:20px">
          <h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.4);margin:0 0 8px">Education</h3>
          ${profile.education.map(e => `<div style="margin-bottom:8px"><p style="font-size:10px;font-weight:600;color:#fff;margin:0">${e.degree || "Degree"}${e.field ? ` — ${e.field}` : ""}</p><p style="font-size:10px;color:rgba(255,255,255,0.5);margin:2px 0">${e.school || ""}</p>${e.startDate ? `<p style="font-size:9px;color:rgba(255,255,255,0.3);margin:2px 0">${e.startDate} — ${e.endDate || "Present"}</p>` : ""}</div>`).join("")}
        </div>` : ""}

        ${profile?.certifications?.length ? `<div>
          <h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:rgba(255,255,255,0.4);margin:0 0 8px">Certifications</h3>
          ${certsHTMLSidebar(profile.certifications)}
        </div>` : ""}
      </div>

      <!-- Main -->
      <div style="flex:1;padding:24px">
        ${profile?.summary ? section("Professional Summary", `<p style="font-size:12px;color:#374151;line-height:1.6;margin:0">${profile.summary}</p>`) : ""}
        ${profile?.experience?.length ? section("Experience", profile.experience.map(e => expBlock(e, bullet)).join("")) : ""}
        ${profile?.projects?.length ? section("Projects", profile.projects.map(pr => projBlock(pr, bullet)).join("")) : ""}
      </div>
    </div>`;
}

// ---- TECHNICAL (right sidebar) ----
function renderTechnical(profile, jobTitle) {
  const p = profile?.personal || {};
  const contact = getContactLine(p);

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;display:flex;color:#111827;min-height:1122px">
      <!-- Main -->
      <div style="flex:1;padding:24px">
        <h1 style="font-size:22px;font-weight:700;margin:0">${p.name || "Your Name"}</h1>
        ${jobTitle ? `<p style="font-size:11px;color:#151965;font-weight:500;margin:4px 0 10px">${jobTitle}</p>` : ""}
        ${contact ? `<p style="font-size:10px;color:#6b7280;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #e5e7eb">${contact}</p>` : ""}

        ${profile?.summary ? `<div style="margin-bottom:16px"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 6px">Summary</h2><p style="font-size:12px;color:#374151;line-height:1.6;margin:0">${profile.summary}</p></div>` : ""}

        ${profile?.experience?.length ? `<div style="margin-bottom:16px">
          <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 8px">Experience</h2>
          ${profile.experience.map(e => `<div style="margin-bottom:10px;padding-left:10px;border-left:2px solid #46B5D1">
            <div style="display:flex;justify-content:space-between;align-items:baseline">
              <p style="font-size:12px;font-weight:600;margin:0">${e.role || "Role"}${e.company ? `<span style="font-weight:400;color:#6b7280"> — ${e.company}</span>` : ""}</p>
              <span style="font-size:10px;color:#9ca3af">${e.startDate || ""}${e.endDate ? ` — ${e.endDate}` : ""}</span>
            </div>
            ${e.responsibilities?.length ? `<ul style="list-style:none;padding:0;margin:4px 0 0">${e.responsibilities.map(r => bullet(r)).join("")}</ul>` : ""}
            ${e.technologies?.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${e.technologies.map(t => `<span style="padding:2px 6px;background:#15196510;color:#151965;font-size:10px;border-radius:3px;font-weight:500">${t}</span>`).join("")}</div>` : ""}
          </div>`).join("")}
        </div>` : ""}

        ${profile?.projects?.length ? `<div style="margin-bottom:16px">
          <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 8px">Projects</h2>
          ${profile.projects.map(pr => `<div style="margin-bottom:10px;padding-left:10px;border-left:2px solid #46B5D1">
            <p style="font-size:12px;font-weight:600;margin:0">${pr.name || "Project"}${pr.type ? `<span style="font-weight:400;color:#6b7280"> (${pr.type})</span>` : ""}</p>
            ${pr.description ? `<p style="font-size:11px;color:#6b7280;margin:2px 0 0">${pr.description}</p>` : ""}
            ${pr.technologies?.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${pr.technologies.map(t => `<span style="padding:2px 6px;background:#15196510;color:#151965;font-size:10px;border-radius:3px;font-weight:500">${t}</span>`).join("")}</div>` : ""}
            ${pr.responsibilities?.length ? `<ul style="list-style:none;padding:0;margin:4px 0 0">${pr.responsibilities.map(r => bullet(r)).join("")}</ul>` : ""}
          </div>`).join("")}
        </div>` : ""}

        ${profile?.education?.length ? `<div>
          <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 8px">Education</h2>
          ${profile.education.map(e => `<div style="margin-bottom:6px;padding-left:10px;border-left:2px solid #46B5D1">
            <p style="font-size:12px;font-weight:600;margin:0">${e.degree || "Degree"}${e.field ? ` — ${e.field}` : ""}</p>
            <p style="font-size:11px;color:#6b7280;margin:2px 0">${e.school || ""}${e.startDate ? ` (${e.startDate} — ${e.endDate || "Present"})` : ""}</p>
          </div>`).join("")}
        </div>` : ""}
      </div>

      <!-- Right Sidebar -->
      <div style="width:180px;background:#f9fafb;border-left:1px solid #e5e7eb;padding:20px;flex-shrink:0">
        ${profile?.skills?.length ? `<div style="margin-bottom:20px"><h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 8px">Skills</h3>${skillsHTMLTags(profile.skills)}</div>` : ""}
        ${profile?.languages?.length ? `<div style="margin-bottom:20px"><h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 8px">Languages</h3>${langsHTMLTags(profile.languages)}</div>` : ""}
        ${profile?.certifications?.length ? `<div><h3 style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#151965;margin:0 0 8px">Certifications</h3>${certsHTMLTags(profile.certifications)}</div>` : ""}
      </div>
    </div>`;
}

function renderCVToHTML(profile, jobTitle, template) {
  switch (template) {
    case "modern": return renderModern(profile, jobTitle);
    case "technical": return renderTechnical(profile, jobTitle);
    default: return renderClassic(profile, jobTitle);
  }
}

export async function generatePDF(elementId, filename, profile, jobTitle, template) {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;background:#fff;z-index:-1";
  container.innerHTML = renderCVToHTML(profile, jobTitle, template);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 794,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
