import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart } from "lucide-react";

export interface ViewModeToggleProps {
  viewMode: "detailed" | "simple";
  onViewModeChange: (mode: "detailed" | "simple") => void;
  className?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className,
}) => {
  return (
    <div
      className={`flex items-center justify-center space-x-2 ${
        className || ""
      }`}
    >
      <Button
        variant={viewMode === "simple" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("simple")}
        className="gap-2"
      >
        <BarChart3 className="h-4 w-4" />
        Simple View
      </Button>
      <Button
        variant={viewMode === "detailed" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("detailed")}
        className="gap-2"
      >
        <PieChart className="h-4 w-4" />
        Detailed View
      </Button>
    </div>
  );
};

export default ViewModeToggle;
