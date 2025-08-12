import {
  AnalyzeRepositoryRequest,
  AnalyzeRepositoryResponse,
  RepositoryAnalysisProgress,
  DocumentationGenerationResult,
  UserDashboardData,
  APIError,
  User,
  RepositoryAnalysis,
} from "@/lib/types";
import { TokenStorage } from "@/lib/utils/cookie.utils";

class APIService {
  private readonly API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Remove /api/v1 from endpoint since it's already included
    const url = `${this.API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    const token = TokenStorage.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: APIError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Repository Analysis Methods
  async analyzeRepository(
    data: AnalyzeRepositoryRequest
  ): Promise<AnalyzeRepositoryResponse> {
    return this.request<AnalyzeRepositoryResponse>(
      "/api/v1/repository-analysis/analyze",
      {
        method: "POST",
        body: JSON.stringify({ repositoryUrl: data.repository_url }),
      }
    );
  }

  async getAnalysisProgress(
    analysisId: string
  ): Promise<RepositoryAnalysisProgress> {
    return this.request<RepositoryAnalysisProgress>(
      `/api/v1/repository-analysis/status/${analysisId}`
    );
  }

  async getAnalysisResult(
    analysisId: string
  ): Promise<DocumentationGenerationResult> {
    return this.request<DocumentationGenerationResult>(
      `/api/v1/repository-analysis/${analysisId}`
    );
  }

  async regenerateDocumentation(
    _analysisId: string
  ): Promise<AnalyzeRepositoryResponse> {
    return this.request<AnalyzeRepositoryResponse>(
      `/api/v1/repository-analysis/analyze`,
      {
        method: "POST",
        body: JSON.stringify({ repositoryUrl: "" }), // TODO: Need to get original repository URL
      }
    );
  }

  // User Authentication Methods
  async authenticateWithGitHub(
    code: string,
    state: string
  ): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>(
      "/api/v1/auth/github/exchange",
      {
        method: "POST",
        body: JSON.stringify({ code, state }),
      }
    );
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/v1/auth/profile");
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      // Clear both localStorage and cookies
      TokenStorage.clearToken();
    }
  }

  // User Dashboard Methods
  async getUserDashboard(): Promise<UserDashboardData> {
    // Now using the proper dashboard endpoint from backend
    return this.request<UserDashboardData>("/api/v1/auth/dashboard");
  }

  async getUserAnalyses(page: number = 1, limit: number = 10) {
    return this.request<{
      analyses: RepositoryAnalysis[];
      total: number;
      page: number;
      limit: number;
    }>(
      `/api/v1/repository-analysis/user/authenticated?page=${page}&limit=${limit}`
    );
  }

  // Feedback Methods
  async submitFeedback(
    documentationId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    // TODO: Backend needs to implement feedback endpoint
    // For now, we'll just log the feedback
    console.log(`Feedback submitted for ${documentationId}:`, {
      rating,
      comment,
    });
    return Promise.resolve();
  }

  // Repository Validation
  async validateRepositoryUrl(url: string): Promise<{
    valid: boolean;
    repository_name?: string;
    repository_owner?: string;
    primary_language?: string;
    is_public: boolean;
    error?: string;
  }> {
    return this.request<{
      valid: boolean;
      repository_name?: string;
      repository_owner?: string;
      primary_language?: string;
      is_public: boolean;
      error?: string;
    }>("/api/v1/repository-analysis/validate", {
      method: "POST",
      body: JSON.stringify({ repositoryUrl: url }),
    });
  }

  // Rate Limiting Info
  async getRateLimitInfo(): Promise<{
    current_usage: number;
    monthly_limit: number;
    reset_date: string;
    plan_type: string;
  }> {
    return this.request<{
      current_usage: number;
      monthly_limit: number;
      reset_date: string;
      plan_type: string;
    }>("/api/v1/rate-limit/limits");
  }
}

// GitHub OAuth Helper
export class GitHubOAuth {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "";
    this.redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || "";
  }

  getAuthUrl(): string {
    if (typeof window === "undefined") {
      throw new Error("GitHubOAuth can only be used in the browser");
    }

    const redirectUri =
      this.redirectUri || `${window.location.origin}/auth/callback`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
      state: this.generateState(),
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

// URL Validation Utilities
export class RepositoryUrlValidator {
  private static readonly GITHUB_URL_REGEX =
    /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/;

  static isValidGitHubUrl(url: string): boolean {
    return this.GITHUB_URL_REGEX.test(url);
  }

  static extractRepoInfo(url: string): { owner: string; repo: string } | null {
    const match = url.match(this.GITHUB_URL_REGEX);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }
    return null;
  }

  static normalizeUrl(url: string): string {
    const repoInfo = this.extractRepoInfo(url);
    if (repoInfo) {
      return `https://github.com/${repoInfo.owner}/${repoInfo.repo}`;
    }
    return url;
  }
}

// Error Handling Utilities
export class APIErrorHandler {
  static getErrorMessage(error: unknown): string {
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "An unexpected error occurred. Please try again.";
  }

  static isRateLimitError(error: unknown): boolean {
    return (
      (error as { message?: string; code?: string })?.message?.includes(
        "rate limit"
      ) ||
      (error as { message?: string; code?: string })?.code ===
        "RATE_LIMIT_EXCEEDED"
    );
  }

  static isAuthenticationError(error: unknown): boolean {
    return (
      (error as { message?: string; code?: string })?.message?.includes(
        "authentication"
      ) ||
      (error as { message?: string; code?: string })?.code === "UNAUTHORIZED"
    );
  }
}

// Singleton instance
export const apiService = new APIService();
export const githubOAuth = new GitHubOAuth();
