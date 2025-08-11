import { useState, useEffect, useCallback } from "react";
import { apiService, APIErrorHandler } from "@/lib/services/api";
import {
  RepositoryAnalysisProgress,
  DocumentationGenerationResult,
  UserDashboardData,
  User,
} from "@/lib/types";

// Hook for repository analysis workflow
export function useRepositoryAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [progress, setProgress] = useState<RepositoryAnalysisProgress | null>(
    null
  );
  const [result, setResult] = useState<DocumentationGenerationResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const analyzeRepository = async (repositoryUrl: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setProgress(null);
      setResult(null);

      const response = await apiService.analyzeRepository({
        repository_url: repositoryUrl,
      });
      setAnalysisId(response.analysis_id);

      // Start polling for progress
      startProgressPolling(response.analysis_id);
    } catch (err) {
      setError(APIErrorHandler.getErrorMessage(err));
      setIsAnalyzing(false);
    }
  };

  const startProgressPolling = (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const progressData = await apiService.getAnalysisProgress(id);
        setProgress(progressData);

        if (progressData.status === "completed") {
          clearInterval(pollInterval);
          const resultData = await apiService.getAnalysisResult(id);
          setResult(resultData);
          setIsAnalyzing(false);
        } else if (progressData.status === "failed") {
          clearInterval(pollInterval);
          setError(progressData.error_message || "Analysis failed");
          setIsAnalyzing(false);
        }
      } catch (err) {
        clearInterval(pollInterval);
        setError(APIErrorHandler.getErrorMessage(err));
        setIsAnalyzing(false);
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup after 5 minutes to avoid infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isAnalyzing) {
        setError("Analysis timeout. Please try again.");
        setIsAnalyzing(false);
      }
    }, 300000);
  };

  const regenerateDocumentation = async () => {
    if (!analysisId) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      setProgress(null);

      const response = await apiService.regenerateDocumentation(analysisId);
      setAnalysisId(response.analysis_id);
      startProgressPolling(response.analysis_id);
    } catch (err) {
      setError(APIErrorHandler.getErrorMessage(err));
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setIsAnalyzing(false);
    setAnalysisId(null);
    setProgress(null);
    setResult(null);
    setError(null);
  };

  return {
    isAnalyzing,
    progress,
    result,
    error,
    analyzeRepository,
    regenerateDocumentation,
    reset,
  };
}

// Hook for user authentication - now using context
export { useAuth } from "@/lib/contexts/auth.context";

// Hook for user dashboard data
export function useUserDashboard() {
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(APIErrorHandler.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}

// Hook for repository URL validation
export function useRepositoryValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    repository_name?: string;
    repository_owner?: string;
    primary_language?: string;
    is_public: boolean;
    error?: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUrl = async (url: string) => {
    if (!url.trim()) {
      setValidationResult(null);
      setValidationError(null);
      return;
    }

    try {
      setIsValidating(true);
      setValidationError(null);
      const result = await apiService.validateRepositoryUrl(url);
      setValidationResult(result);

      if (!result.valid) {
        setValidationError(result.error || "Invalid repository URL");
      }
    } catch (err) {
      setValidationError(APIErrorHandler.getErrorMessage(err));
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  const reset = () => {
    setValidationResult(null);
    setValidationError(null);
    setIsValidating(false);
  };

  return {
    isValidating,
    validationResult,
    validationError,
    validateUrl,
    reset,
  };
}

// Hook for rate limiting information
export function useRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    current_usage: number;
    monthly_limit: number;
    reset_date: string;
    plan_type: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRateLimitInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await apiService.getRateLimitInfo();
      setRateLimitInfo(info);
    } catch (err) {
      console.error("Failed to fetch rate limit info:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRateLimitInfo();
  }, [fetchRateLimitInfo]);

  const isLimitReached = rateLimitInfo
    ? rateLimitInfo.current_usage >= rateLimitInfo.monthly_limit &&
      rateLimitInfo.monthly_limit > 0
    : false;

  return {
    rateLimitInfo,
    isLoading,
    isLimitReached,
    refetch: fetchRateLimitInfo,
  };
}

// Hook for feedback submission
export function useFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitFeedback = async (
    documentationId: string,
    rating: number,
    comment?: string
  ) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      await apiService.submitFeedback(documentationId, rating, comment);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(APIErrorHandler.getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitFeedback,
    reset,
  };
}
