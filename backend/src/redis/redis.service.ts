import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: 'redis',
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

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    if (!this.client) return;

    this.logger.log('Closing Redis connection...');
    await this.client.quit(); // graceful
    this.logger.warn('Redis connection closed');
  }
}
