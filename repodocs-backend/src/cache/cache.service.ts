import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  async reset(): Promise<void> {
    try {
      // Note: cache-manager v4+ doesn't have reset method
      // In a real implementation, you might want to use Redis SCAN and DEL
      this.logger.warn('Cache reset not implemented in this version');
    } catch (error) {
      this.logger.error('Error resetting cache:', error);
    }
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    try {
      let value = await this.get<T>(key);

      if (value === undefined) {
        value = await factory();
        await this.set(key, value, ttl);
      }

      return value;
    } catch (error) {
      this.logger.error(`Error in getOrSet for key ${key}:`, error);
      // Fallback to factory if cache fails
      return await factory();
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      // Note: This is a simplified implementation
      // In a real Redis setup, you might want to use SCAN command
      this.logger.warn('Pattern-based invalidation not implemented');
    } catch (error) {
      this.logger.error(`Error invalidating pattern ${pattern}:`, error);
    }
  }

  async getStats(): Promise<{ keys: number; memory: string }> {
    try {
      // Note: This is a simplified implementation
      // In a real Redis setup, you might want to use INFO command
      return {
        keys: 0,
        memory: 'N/A',
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return {
        keys: 0,
        memory: 'N/A',
      };
    }
  }
}
