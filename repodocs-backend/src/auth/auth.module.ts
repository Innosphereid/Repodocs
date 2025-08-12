import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { RepositoryAnalysis } from '../database/entities/repository-analysis.entity';
import { GeneratedDocumentation } from '../database/entities/generated-documentation.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('app.jwtSecret'),
        signOptions: {
          expiresIn: '7d', // 7 days
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      RepositoryAnalysis,
      GeneratedDocumentation,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GitHubStrategy, LocalStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
