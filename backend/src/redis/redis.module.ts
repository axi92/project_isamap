import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    const isProd = process.env.NODE_ENV === 'production';

    return {
      module: RedisModule,
      providers: [
        {
          provide: RedisService,
          useClass: isProd ? RedisService : class DummyRedisService {},
        },
      ],
      exports: [RedisService],
    };
  }
}
