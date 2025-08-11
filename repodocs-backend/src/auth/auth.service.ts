import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, PlanType } from '../database/entities/user.entity';
import {
  RepositoryAnalysis,
  AnalysisStatus,
} from '../database/entities/repository-analysis.entity';
import { GeneratedDocumentation } from '../database/entities/generated-documentation.entity';
import { ConfigService } from '@nestjs/config';
import { SecurityUtil } from '../utils';

export interface JwtPayload {
  sub: string;
  username: string;
  githubId?: number;
  planType: PlanType;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    planType: PlanType;
    monthlyUsageCount: number;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RepositoryAnalysis)
    private readonly repositoryAnalysisRepository: Repository<RepositoryAnalysis>,
    @InjectRepository(GeneratedDocumentation)
    private readonly generatedDocumentationRepository: Repository<GeneratedDocumentation>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    githubId: number,
    username: string,
    email?: string,
    avatarUrl?: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({ where: { githubId } });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        githubId,
        username,
        email,
        avatarUrl,
        planType: PlanType.FREE,
        monthlyUsageCount: 0,
        usageResetDate: new Date(),
      });
      await this.userRepository.save(user);
    } else {
      // Update existing user info
      user.username = username;
      user.email = email || user.email;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      await this.userRepository.save(user);
    }

    return user;
  }

  async validateLocalUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await SecurityUtil.comparePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async createLocalUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    // Validate password strength
    const passwordValidation = SecurityUtil.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password and create user
    const passwordHash = await SecurityUtil.hashPassword(password);

    const user = this.userRepository.create({
      username: SecurityUtil.sanitizeInput(username),
      email: SecurityUtil.sanitizeInput(email),
      passwordHash,
      planType: PlanType.FREE,
      monthlyUsageCount: 0,
      usageResetDate: new Date(),
    });

    return this.userRepository.save(user);
  }

  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      githubId: user.githubId,
      planType: user.planType,
    };

    return this.jwtService.sign(payload);
  }

  async login(user: User): Promise<AuthResponse> {
    const token = await this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        planType: user.planType,
        monthlyUsageCount: user.monthlyUsageCount,
      },
    };
  }

  async refreshToken(userId: string): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async updateUserPlan(userId: string, planType: PlanType): Promise<User> {
    const user = await this.getUserById(userId);
    user.planType = planType;
    return this.userRepository.save(user);
  }

  async resetMonthlyUsage(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    user.monthlyUsageCount = 0;
    user.usageResetDate = new Date();
    await this.userRepository.save(user);
  }

  async incrementUsageCount(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    user.monthlyUsageCount += 1;
    await this.userRepository.save(user);
  }

  async checkUsageLimit(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);

    // Check if it's a new month
    const now = new Date();
    const lastReset = new Date(user.usageResetDate);
    if (
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      await this.resetMonthlyUsage(userId);
      return true;
    }

    // Check usage limits based on plan
    const limits = {
      [PlanType.FREE]: 10,
      [PlanType.PRO]: 100,
      [PlanType.TEAM]: -1, // Unlimited
    };

    const limit = limits[user.planType];
    return limit === -1 || user.monthlyUsageCount < limit;
  }

  async exchangeGitHubCode(code: string, state: string): Promise<AuthResponse> {
    try {
      // Exchange OAuth code for access token using GitHub API
      const tokenResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: this.configService.get('github.clientId'),
            client_secret: this.configService.get('github.clientSecret'),
            code,
            state,
          }),
        },
      );

      if (!tokenResponse.ok) {
        throw new Error(
          `GitHub token exchange failed: ${tokenResponse.statusText}`,
        );
      }

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        throw new Error(
          `GitHub OAuth error: ${tokenData.error_description || tokenData.error}`,
        );
      }

      const accessToken = tokenData.access_token;
      if (!accessToken) {
        throw new Error('No access token received from GitHub');
      }

      // Get user profile from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userResponse.ok) {
        throw new Error(
          `Failed to fetch GitHub user profile: ${userResponse.statusText}`,
        );
      }

      const githubUser = await userResponse.json();

      // Get user emails
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      let email: string | undefined;
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail?.email;
      }

      // Validate or create user
      const user = await this.validateUser(
        githubUser.id,
        githubUser.login,
        email,
        githubUser.avatar_url,
      );

      // Generate JWT token and return auth response
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException(
        `GitHub OAuth exchange failed: ${error.message}`,
      );
    }
  }

  async getUserDashboard(userId: string) {
    try {
      // Get user data
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Get recent analyses (10 most recent)
      const recentAnalyses = await this.repositoryAnalysisRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 10,
      });

      // Get total repositories count
      const totalRepositories = await this.repositoryAnalysisRepository.count({
        where: { userId },
      });

      // Get successful generations count (completed analyses)
      const successfulGenerations =
        await this.repositoryAnalysisRepository.count({
          where: { userId, analysisStatus: AnalysisStatus.COMPLETED },
        });

      // Get average rating from generated documentation
      const averageRatingResult = await this.generatedDocumentationRepository
        .createQueryBuilder('gd')
        .select('AVG(gd.userFeedbackRating)', 'averageRating')
        .innerJoin('gd.analysis', 'ra')
        .where('ra.userId = :userId', { userId })
        .andWhere('gd.userFeedbackRating IS NOT NULL')
        .getRawOne();

      const averageRating = averageRatingResult?.averageRating || 0;

      // Calculate days until reset
      const now = new Date();
      const resetDate = new Date(user.usageResetDate);
      const daysUntilReset = Math.ceil(
        (resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Calculate monthly limit based on plan type
      const monthlyLimit =
        user.planType === PlanType.FREE
          ? 10
          : user.planType === PlanType.PRO
            ? 100
            : -1; // -1 for unlimited

      return {
        user: {
          id: user.id,
          github_id: user.githubId,
          username: user.username,
          email: user.email,
          avatar_url: user.avatarUrl,
          plan_type: user.planType,
          monthly_usage_count: user.monthlyUsageCount,
          usage_reset_date: user.usageResetDate.toISOString(),
          created_at: user.createdAt.toISOString(),
          updated_at: user.updatedAt.toISOString(),
        },
        recent_analyses: recentAnalyses.map(analysis => ({
          id: analysis.id,
          user_id: analysis.userId,
          user_ip_hash: analysis.userIpHash,
          repository_url: analysis.repositoryUrl,
          repository_name: analysis.repositoryName,
          repository_owner: analysis.repositoryOwner,
          primary_language: analysis.primaryLanguage,
          framework_detected: analysis.frameworkDetected,
          file_count: analysis.fileCount,
          total_size_bytes: analysis.totalSizeBytes,
          analysis_status: analysis.analysisStatus,
          ai_model_used: analysis.aiModelUsed,
          processing_time_seconds: analysis.processingTimeSeconds,
          created_at: analysis.createdAt.toISOString(),
          completed_at: analysis.completedAt?.toISOString(),
        })),
        usage_stats: {
          current_month_usage: user.monthlyUsageCount,
          total_repositories: totalRepositories,
          successful_generations: successfulGenerations,
          average_rating: parseFloat(averageRating),
        },
        plan_limits: {
          monthly_limit: monthlyLimit,
          current_usage: user.monthlyUsageCount,
          days_until_reset: daysUntilReset,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(
        `Failed to get user dashboard: ${error.message}`,
      );
    }
  }
}
