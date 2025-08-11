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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class APIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
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

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("github_token");
    }
    return null;
  }

  // Repository Analysis Methods
  async analyzeRepository(
    data: AnalyzeRepositoryRequest
  ): Promise<AnalyzeRepositoryResponse> {
    return this.request<AnalyzeRepositoryResponse>("/repositories/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAnalysisProgress(
    analysisId: string
  ): Promise<RepositoryAnalysisProgress> {
    return this.request<RepositoryAnalysisProgress>(
      `/repositories/analyze/${analysisId}/progress`
    );
  }

  async getAnalysisResult(
    analysisId: string
  ): Promise<DocumentationGenerationResult> {
    return this.request<DocumentationGenerationResult>(
      `/repositories/analyze/${analysisId}/result`
    );
  }

  async regenerateDocumentation(
    analysisId: string
  ): Promise<AnalyzeRepositoryResponse> {
    return this.request<AnalyzeRepositoryResponse>(
      `/repositories/analyze/${analysisId}/regenerate`,
      {
        method: "POST",
      }
    );
  }

  // User Authentication Methods
  async authenticateWithGitHub(
    code: string
  ): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>(
      "/auth/github/callback",
      {
        method: "POST",
        body: JSON.stringify({ code }),
      }
    );
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("github_token");
    }
  }

  // User Dashboard Methods
  async getUserDashboard(): Promise<UserDashboardData> {
    return this.request<UserDashboardData>("/user/dashboard");
  }

  async getUserAnalyses(page: number = 1, limit: number = 10) {
    return this.request<{
      analyses: RepositoryAnalysis[];
      total: number;
      page: number;
      limit: number;
    }>(`/user/analyses?page=${page}&limit=${limit}`);
  }

  // Feedback Methods
  async submitFeedback(
    documentationId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    return this.request<void>(`/documentation/${documentationId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
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
    }>("/repositories/validate", {
      method: "POST",
      body: JSON.stringify({ repository_url: url }),
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
    }>("/user/rate-limit");
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
