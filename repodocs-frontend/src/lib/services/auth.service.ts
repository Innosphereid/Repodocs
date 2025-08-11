import axios, { AxiosInstance, AxiosResponse } from "axios";
import { User } from "@/lib/types";

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    planType: string;
    monthlyUsageCount: number;
  };
}

export interface AuthStatus {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    planType: string;
  };
}

export interface LocalAuthDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

class AuthService {
  private api: AxiosInstance;
  private readonly API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  constructor() {
    this.api = axios.create({
      baseURL: this.API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor untuk menambahkan token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor untuk handling error
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // Redirect ke login page jika unauthorized
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  private clearAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  // GitHub OAuth
  async initiateGitHubAuth(): Promise<string> {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri =
      process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI ||
      `${window.location.origin}/auth/callback`;

    if (!clientId) {
      throw new Error("GitHub Client ID not configured");
    }

    const state = this.generateState();
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=read:user,user:email&state=${state}`;

    // Store state for verification
    if (typeof window !== "undefined") {
      localStorage.setItem("github_oauth_state", state);
    }

    return authUrl;
  }

  async handleGitHubCallback(
    code: string,
    state: string
  ): Promise<AuthResponse> {
    // Verify state
    const storedState =
      typeof window !== "undefined"
        ? localStorage.getItem("github_oauth_state")
        : null;
    if (storedState !== state) {
      throw new Error("Invalid OAuth state");
    }

    try {
      // Redirect to backend OAuth callback
      const response = await this.api.get(
        `/auth/github/callback?code=${code}&state=${state}`
      );

      // Clear stored state
      if (typeof window !== "undefined") {
        localStorage.removeItem("github_oauth_state");
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Local Authentication
  async localLogin(credentials: LocalAuthDto): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        "/auth/login",
        credentials
      );
      const { access_token, user } = response.data;

      this.setAuthToken(access_token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async localRegister(userData: CreateUserDto): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        "/auth/register",
        userData
      );
      const { access_token, user } = response.data;

      this.setAuthToken(access_token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Token Management
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        "/auth/refresh"
      );
      const { access_token, user } = response.data;

      this.setAuthToken(access_token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthToken();
    }
  }

  // User Profile
  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAuthStatus(): Promise<AuthStatus> {
    try {
      const response: AxiosResponse<AuthStatus> = await this.api.get(
        "/auth/status"
      );
      return response.data;
    } catch (error) {
      return { authenticated: false };
    }
  }

  // Utility methods
  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error("An unexpected error occurred");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get current user from token (basic info)
  getCurrentUser(): User | null {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user info (basic implementation)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub,
        username: payload.username,
        plan_type: payload.planType,
        monthly_usage_count: payload.monthlyUsageCount || 0,
        usage_reset_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
