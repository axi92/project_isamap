//'redis://172.19.85.137:6379', //redis://redis:6379

import { Module, Global } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { RedisStore } from 'connect-redis';

@Global()
@Module({})
export class RedisModule {
  static forRoot() {
    const isProd = process.env.NODE_ENV === 'production';

    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: async (): Promise<RedisClientType | null> => {
        if (!isProd) return null;

        const client: RedisClientType = createClient({
          url: process.env.REDIS_URL || 'redis://172.19.85.137:6379',
        });

        client.on('error', (err) => {
          console.error('Redis client error', err);
        });

        await client.connect(); // connect waits for ready
        console.log('Redis connected');
        return client;
      },
    };

    const sessionStoreProvider = {
      provide: 'SESSION_STORE',
      inject: ['REDIS_CLIENT'],
      useFactory: (client: RedisClientType | null) => {
        if (!client) {
          console.log('DEV mode: MemoryStore for sessions');
          return undefined; // fallback MemoryStore in dev
        }

        return new RedisStore({ client, prefix: 'sess:' });
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider, sessionStoreProvider],
      exports: ['REDIS_CLIENT', 'SESSION_STORE'],
    };
  }
}
