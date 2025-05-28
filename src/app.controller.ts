import { Controller, Logger, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { LowdbService } from "./lowdb/lowdb.service";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly lowdbService: LowdbService,
  ) {}
}
