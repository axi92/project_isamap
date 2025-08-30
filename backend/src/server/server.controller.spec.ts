import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { LowdbService } from '@/lowdb/lowdb.service';
import { UserService } from '@/user/user.service';
import { LiveMapDTO } from './dto/server.dto';
import { exampleServerData } from './server.test.data';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('ServerController', () => {
  let controller: ServerController;
  let serverService: ServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerService, LowdbService, UserService],
    }).compile();

    controller = module.get<ServerController>(ServerController);
    serverService = module.get<ServerService>(ServerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(serverService).toBeDefined();
  });

  it('should return all servers from service', async () => {
    const mockServers = [
      { id: 1, name: 'Server1' },
      { id: 2, name: 'Server2' },
    ];
    jest.spyOn(serverService, 'getAll').mockResolvedValueOnce(mockServers);

    const result = await controller.allServers();
    expect(result).toEqual(mockServers);
    expect(serverService.getAll).toHaveBeenCalledTimes(1);
  });

  it('should pass the validation on the LiveMapDTO', async () => {
    const dto = plainToInstance(LiveMapDTO, exampleServerData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
