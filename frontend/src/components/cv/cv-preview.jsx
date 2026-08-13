"use client";

import { forwardRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import ClassicTemplate from "./templates/classic";
import ModernTemplate from "./templates/modern";
import TechnicalTemplate from "./templates/technical";

const ZOOM_LEVELS = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

const CvPreview = forwardRef(function CvPreview({ profile, jobTitle, template = "classic" }, ref) {
  const [zoom, setZoom] = useState(0.6);

  const hasContent = profile?.summary || profile?.experience?.length || profile?.projects?.length || profile?.skills?.length || profile?.education?.length;

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.0));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.4));
  const resetZoom = () => setZoom(0.6);

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* CV Preview */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          ref={ref}
          id="cv-preview-content"
          className="bg-white rounded-xl shadow-lg border border-border"
          style={{
            width: "794px",
            transformOrigin: "top center",
            transform: `scale(${zoom})`,
            marginBottom: `${-(794 * (297 / 210) * (1 - zoom))}px`,
          }}
        >
          {template === "classic" && <ClassicTemplate profile={profile} jobTitle={jobTitle} />}
          {template === "modern" && <ModernTemplate profile={profile} jobTitle={jobTitle} />}
          {template === "technical" && <TechnicalTemplate profile={profile} jobTitle={jobTitle} />}

          {!hasContent && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-sm">Your CV will appear here as you chat with the AI.</p>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white border border-border rounded-xl shadow-lg px-2 py-1.5">
        <button
          onClick={zoomOut}
          disabled={zoom <= 0.4}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
        >
          <ZoomOut size={14} className="text-navy" />
        </button>
        <span className="text-xs font-medium text-navy w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={zoomIn}
          disabled={zoom >= 1.0}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
        >
          <ZoomIn size={14} className="text-navy" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button onClick={resetZoom} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Reset zoom">
          <RotateCcw size={12} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
});

export default CvPreview;
