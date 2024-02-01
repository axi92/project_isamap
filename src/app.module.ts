import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { GatewayModule } from './gateway/gateway.module.js';
import { fileURLToPath } from "node:url";
import path from "node:path";
import {LowdbService} from "./lowdb/lowdb.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '..', 'client/dist'), // New
    }), // New
    GatewayModule
  ],
  controllers: [AppController],
  providers: [AppService, LowdbService],
})
export class AppModule {}
