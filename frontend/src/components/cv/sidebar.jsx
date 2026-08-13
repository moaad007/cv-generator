"use client";

import { Check, Circle, FileText, GraduationCap, Briefcase, Lightbulb, User, Download, Loader2, Plus } from "lucide-react";

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Lightbulb },
  { id: "summary", label: "Summary", icon: FileText },
];

export default function Sidebar({ activeSection, completedSections, progress, onDownload, onNewCV, generatingPDF }) {
  return (
    <aside className="w-64 bg-navy text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-navy-light">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-teal text-2xl">◆</span>
          CVPilot
        </h1>
      </div>

      {/* CV Builder Progress */}
      <div className="px-5 py-4 border-b border-navy-light">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center">
            <span className="text-teal font-bold text-sm">{Math.round(progress)}%</span>
          </div>
          <div>
            <p className="font-medium text-sm">CV Builder</p>
            <p className="text-xs text-white/60">{Math.round(progress)}% Complete</p>
          </div>
        </div>
        <div className="w-full h-1.5 bg-navy-light rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isCompleted = completedSections.includes(section.id);
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ${
                isActive
                  ? "bg-navy-light text-white font-medium"
                  : "text-white/70 hover:bg-navy-light/50 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{section.label}</span>
              {isCompleted ? (
                <Check size={16} className="text-teal" />
              ) : (
                <Circle size={8} className="text-white/40" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Buttons */}
      <div className="p-4 border-t border-navy-light space-y-2">
        <button
          onClick={onDownload}
          disabled={generatingPDF || progress < 40}
          className="w-full flex items-center justify-center gap-2 bg-teal hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          {generatingPDF ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={16} />
              Download CV
            </>
          )}
        </button>
        <button
          onClick={onNewCV}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white/80 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          <Plus size={16} />
          New CV
        </button>
      </div>
    </aside>
  );
}
