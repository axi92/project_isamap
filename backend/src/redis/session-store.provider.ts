// TODO: This file is useless we can remove it
import { Provider } from '@nestjs/common';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { RedisService } from './redis.service';

export const SessionStoreProvider: Provider = {
  provide: 'SESSION_STORE',
  inject: [RedisService], // always inject, but we will handle undefined
  useFactory: async (redisService?: RedisService): Promise<session.Store> => {
    // Dev: RedisService is DummyRedisService
    if (!redisService || typeof redisService.getClient !== 'function') {
      console.log('DEV mode: using MemoryStore');
      return undefined; // fallback to MemoryStore
    }

    // Make sure client is ready
    const client = await redisService.getClient();
    console.log('redis client in session-store.provider');
    console.log(client);

    return new RedisStore({
      client: client,
      prefix: 'sess:',
    });
  },
};
