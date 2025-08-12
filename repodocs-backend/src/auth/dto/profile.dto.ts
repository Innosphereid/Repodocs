import { PlanType } from '../../database/entities/user.entity';

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
  plan_type: PlanType;
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
  current_plan: PlanType;
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
