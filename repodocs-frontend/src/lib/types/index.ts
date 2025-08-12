// Core types based on the PRD database schema and business logic

export interface User {
  id: string;
  github_id?: number;
  username: string;
  email?: string;
  avatar_url?: string;
  plan_type: "free" | "pro" | "team";
  monthly_usage_count: number;
  usage_reset_date: string;
  created_at: string;
  updated_at: string;
}

// New Profile Response Interfaces
export interface PlanFeatures {
  repository_analysis: boolean;
  documentation_generation: boolean;
  basic_support: boolean;
  monthly_limit: number;
  private_repos: boolean;
  priority_processing: boolean;
  advanced_analytics: boolean;
  team_features: boolean;
  priority_support: boolean;
}

export interface UserProfileData {
  id: string;
  github_id?: number;
  username: string;
  email?: string;
  avatar_url?: string;
  plan_type: "free" | "pro" | "team";
  monthly_usage_count: number;
  usage_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileStats {
  current_month_usage: number;
  total_repositories: number;
  successful_generations: number;
  days_until_reset: number;
  account_age_days: number;
  days_since_last_activity: number;
}

export interface PlanDetails {
  current_plan: "free" | "pro" | "team";
  monthly_limit: number;
  features: PlanFeatures;
}

export interface SecurityStatus {
  github_connected: boolean;
  password_set: boolean;
  two_factor_enabled: boolean;
  last_login: string;
}

export interface UserProfileResponse {
  user: UserProfileData;
  profile_stats: ProfileStats;
  plan_details: PlanDetails;
  security_status: SecurityStatus;
}

export interface RepositoryAnalysis {
  id: string;
  user_id?: string;
  user_ip_hash?: string;
  repository_url: string;
  repository_name: string;
  repository_owner: string;
  primary_language?: string;
  framework_detected?: string;
  file_count?: number;
  total_size_bytes?: number;
  analysis_status: "pending" | "processing" | "completed" | "failed";
  ai_model_used?: string;
  processing_time_seconds?: number;
  created_at: string;
  completed_at?: string;
}

export interface GeneratedDocumentation {
  id: string;
  analysis_id: string;
  original_readme_content?: string;
  generated_content: string;
  content_sections: {
    description?: string;
    installation?: string;
    usage?: string;
    api?: string;
    contributing?: string;
    [key: string]: string | undefined;
  };
  github_pr_number?: number;
  github_pr_url?: string;
  pr_status?: "created" | "merged" | "closed";
  user_feedback_rating?: number;
  user_feedback_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface RateLimit {
  ip_hash: string;
  usage_count: number;
  last_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface AIUsageLog {
  id: string;
  analysis_id: string;
  provider: "openai" | "anthropic";
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  latency_ms: number;
  created_at: string;
}

// API Request/Response types
export interface AnalyzeRepositoryRequest {
  repository_url: string;
  user_token?: string;
}

export interface AnalyzeRepositoryResponse {
  analysis_id: string;
  status: "pending" | "processing";
  estimated_time_seconds: number;
}

export interface RepositoryAnalysisProgress {
  analysis_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress_percentage: number;
  current_step: string;
  estimated_remaining_seconds?: number;
  error_message?: string;
}

export interface DocumentationGenerationResult {
  analysis: RepositoryAnalysis;
  documentation: GeneratedDocumentation;
  pull_request_url?: string;
}

// UI Component Props types
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface RepositoryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export interface ProgressTrackerProps {
  analysis: RepositoryAnalysisProgress;
  className?: string;
}

export interface DocumentationPreviewProps {
  documentation: GeneratedDocumentation;
  originalContent?: string;
  showDiff?: boolean;
  onApprove?: () => void;
  onRegenerate?: () => void;
  className?: string;
}

export interface UserDashboardData {
  user: User;
  recent_analyses: RepositoryAnalysis[];
  usage_stats: {
    current_month_usage: number;
    total_repositories: number;
    successful_generations: number;
    average_rating: number;
  };
  plan_limits: {
    monthly_limit: number;
    current_usage: number;
    days_until_reset: number;
  };
}

// Error types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Plan configuration
export interface PlanConfig {
  id: "anonymous" | "free" | "pro" | "team";
  name: string;
  monthly_limit: number;
  features: string[];
  price_usd?: number;
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  anonymous: {
    id: "anonymous",
    name: "Anonymous",
    monthly_limit: 3,
    features: ["Basic documentation generation", "Public repositories only"],
  },
  free: {
    id: "free",
    name: "Free Account",
    monthly_limit: 10,
    features: ["GitHub OAuth", "Usage dashboard", "Public repositories only"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthly_limit: 100,
    features: [
      "Priority processing",
      "Private repositories",
      "Advanced analytics",
    ],
    price_usd: 9,
  },
  team: {
    id: "team",
    name: "Team",
    monthly_limit: -1, // unlimited
    features: [
      "Unlimited generations",
      "Team features",
      "Advanced analytics",
      "Priority support",
    ],
    price_usd: 29,
  },
};
