import { Test, TestingModule } from '@nestjs/testing';
import { ServerService } from './server.service';
import { LowdbService } from '../lowdb/lowdb.service';
import { UserService } from '../user/user.service';
import { exampleServerData, serverCreateTestData } from './server.test.data';
import { DB_FILENAME } from '../lowdb/lowdb.constants';
import { userTestTemplate } from '../user/user.constants';
import { ServerEntry } from './server.interface';
import { NotFoundException } from '@nestjs/common';

describe('ServerService', () => {
  let serverService: ServerService;
  let userService: UserService;
  let dbService: LowdbService;
  let serverEntry: ServerEntry;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerService, LowdbService, UserService],
    }).compile();

    serverService = module.get<ServerService>(ServerService);
    userService = module.get<UserService>(UserService);
    dbService = module.get<LowdbService>(LowdbService);

    // Initialize the data
    await dbService.onModuleInit(DB_FILENAME);
    await userService.create(userTestTemplate);
  });

  it('should be defined', () => {
    expect(serverService).toBeDefined();
  });

  it('get server data by publicId and throw exception', () => {
    // Give false id, it does not matter because ther is no data yet
    const data = serverService.getServerDataByPublicId(
      exampleServerData.privateid,
    );
    expect(data).toBeInstanceOf(NotFoundException);
  });

  it('handle livemap data with exception', async () => {
    await expect(
      serverService.processData(exampleServerData),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('handle livemap data with success', async () => {
    // Create server entry to test with
    serverEntry = (await serverService.create(
      serverCreateTestData,
    )) as ServerEntry;
    exampleServerData.privateid = serverEntry.privateId;

    const response = await serverService.processData(exampleServerData);
    expect(response).toMatchObject({
      owner: expect.any(String),
      privateId: expect.any(String),
      publicId: expect.any(String),
      description: expect.any(String),
    });
  });
});
