import { Test, TestingModule } from '@nestjs/testing';
import { ServerService } from './server.service';
import { LowdbService } from '../lowdb/lowdb.service';
import { UserService } from '../user/user.service';

describe('ServerService', () => {
  let service: ServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerService, LowdbService, UserService],
    }).compile();

    service = module.get<ServerService>(ServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
