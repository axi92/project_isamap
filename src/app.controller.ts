import { Controller, Logger, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(private readonly appService: AppService) {}

  @Post('v1')
  digestServerData(@Query() json: JSON): string {
    this.logger.log(json)
    return `This action returns a\n ${JSON.stringify(json, null, 2)}`;
  }
}
