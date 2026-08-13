"use client";

const templates = [
  { id: "classic", name: "Classic", desc: "Single column, ATS-friendly" },
  { id: "modern", name: "Modern", desc: "Dark sidebar, visual skills" },
  { id: "technical", name: "Technical", desc: "Right sidebar, tech tags" },
];

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div className="flex items-center gap-2">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selected === t.id
              ? "bg-navy text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
          title={t.desc}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
