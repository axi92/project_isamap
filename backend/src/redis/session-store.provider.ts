import { Provider } from '@nestjs/common';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { RedisService } from './redis.service';

export const SessionStoreProvider: Provider = {
  provide: 'SESSION_STORE',
  inject: [RedisService], // always inject, but we will handle undefined
  useFactory: (redisService?: RedisService): session.Store | undefined => {
    // Dev: RedisService is DummyRedisService
    if (!redisService || typeof redisService.getClient !== 'function') {
      console.log('DEV mode: using MemoryStore');
      return undefined; // fallback to MemoryStore
    }
    return new RedisStore({
      client: redisService.getClient(),
      prefix: 'sess:',
    });
  },
};
