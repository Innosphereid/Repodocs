import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { cn } from "@/lib/utils";
import { RepositoryUrlValidator } from "@/lib/services/api";
import { Github, AlertCircle } from "lucide-react";

export interface RepositoryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const RepositoryInput: React.FC<RepositoryInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  error,
  placeholder = "https://github.com/username/repository",
  className,
  disabled = false,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!value.trim()) {
      setLocalError("Please enter a repository URL");
      return;
    }

    if (!RepositoryUrlValidator.isValidGitHubUrl(value)) {
      setLocalError("Please enter a valid GitHub repository URL");
      return;
    }

    onSubmit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear errors when user starts typing
    if (localError || error) {
      setLocalError(null);
    }
  };

  const displayError = error || localError;

  return (
    <div className={cn("w-full space-y-4", className)}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Github className="h-5 w-5" />
          </div>
          <Input
            type="url"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              "pl-11 pr-4 py-3 text-lg",
              displayError && "border-red-500 focus:border-red-500"
            )}
            aria-label="GitHub repository URL"
          />
        </div>
        <Button
          type="submit"
          disabled={disabled || isLoading || !value.trim()}
          className="px-8 py-3 text-lg font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              Analyzing...
            </>
          ) : (
            "Generate Docs"
          )}
        </Button>
      </form>

      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-600">
        <p>
          Enter a public GitHub repository URL to generate professional
          documentation
        </p>
        <p className="mt-1">
          <span className="font-medium">Example:</span>{" "}
          https://github.com/vercel/next.js
        </p>
      </div>
    </div>
  );
};

export default RepositoryInput;
