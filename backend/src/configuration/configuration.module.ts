import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigurationService } from './configuration.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigurationService, ConfigService],
  exports: [ConfigurationService],
})
export class ConfigurationModule implements OnModuleInit {
  async onModuleInit() {
    await ConfigModule.envVariablesLoaded;
  }
}
