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
}
