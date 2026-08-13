"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mx-auto mb-4">
          <Loader2 size={24} className="text-teal animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">
          Loading CVPilot{dots}
        </p>
      </div>
    </div>
  );
}
