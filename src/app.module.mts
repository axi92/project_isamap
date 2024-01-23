import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mts';
import { AppService } from './app.service.mts';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { GatewayModule } from './gateway/gateway.module.mts';

@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '..', 'client/dist'), // New
    }), // New
    GatewayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
