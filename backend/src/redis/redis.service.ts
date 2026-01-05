import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit() {
    console.log('redisService OnModuleInit before redis client created');
    this.client = new Redis({
      host: 'redis',
      lazyConnect: false, // connect immediately
      maxRetriesPerRequest: null,
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));

    this.client.on('error', (err) => this.logger.error('Redis error', err));

    // ⏳ WAIT until Redis is really ready
    await new Promise<void>((resolve, reject) => {
      this.client.once('ready', () => {
        this.logger.log('Redis ready');
        resolve();
      });

      this.client.once('error', (err) => {
        this.logger.error('Redis connection failed', err);
        reject(err);
      });
    });
  }

  async getClient(): Promise<Redis> {
    if (!this.client) throw new Error('Redis client not initialized');
    if (this.client.status === 'ready') return this.client;

    await new Promise<void>((resolve, reject) => {
      this.client.once('ready', () => resolve());
      this.client.once('error', reject);
    });
    return this.client;
  }

  getStore(): RedisStore {
    return new RedisStore({
      client: this.client,
      prefix: 'sess:',
    });
  }

  async onModuleDestroy() {
    if (!this.client) return;

    this.logger.log('Closing Redis connection...');
    await this.client.quit(); // graceful
    this.logger.warn('Redis connection closed');
  }
}
