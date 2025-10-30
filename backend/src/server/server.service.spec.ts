import { Test, TestingModule } from '@nestjs/testing';
import { ServerService } from './server.service';
import { LowdbService } from '@/lowdb/lowdb.service';
import { UserService } from '@/user/user.service';
import { exampleServerData, serverCreateTestData } from './server.test.data';
import { DB_FILENAME } from '@/lowdb/lowdb.constants';
import { userTestTemplate } from '@/user/user.constants';
import { ServerEntry } from './server.interface';
import { BadRequestException } from '@nestjs/common';
import { ERROR_INVALID_OWNER } from './server.constants';
import { ServerCreateDto } from './dto/serverCreate.dto';

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

  it('get server data by false publicId and result should be null', () => {
    // Give false id, it does not matter because ther is no data yet
    const data = serverService.getServerDataByPublicId(
      exampleServerData.privateid,
    );
    expect(data).toBeNull();
  });

  it('handle incomming livemap data with no matching server entry', async () => {
    const data = await serverService.processData(exampleServerData);
    expect(data).toBeFalsy();
  });

  it('handle livemap data with success', async () => {
    // Create server entry to test with
    serverEntry = (await serverService.create(
      serverCreateTestData,
    )) as ServerEntry;
    exampleServerData.privateid = serverEntry.privateId;

    const response = await serverService.processData(exampleServerData);
    expect(response).toBeTruthy();
  });

  it('should throw BadRequestException if owner does not exist', async () => {
    const invalidOwnerDto = {
      owner: 'nonexistent-user',
      description: 'Invalid server',
    } as ServerEntry;

    await expect(serverService.create(invalidOwnerDto)).rejects.toThrow(
      new BadRequestException(ERROR_INVALID_OWNER),
    );
  });

  it('should return false when deleting non-existing server', async () => {
    const result = await serverService.delete('nonexistent-public-id');
    expect(result).toBe(false);
  });

  it('should delete an existing server and return true', async () => {
    // Create owner
    const user = await userService.create(userTestTemplate);

    // Create a server for created owner
    const entry = await serverService.create({
      owner: user.userId,
      description: 'Test server for delete',
    } as ServerCreateDto);

    expect((entry as ServerEntry).owner).toBe(user.userId);

    const publicId = (entry as ServerEntry).publicId;

    // Delete it
    const result = await serverService.delete(publicId);
    expect(result).toBe(true);

    // Verify it’s gone
    const findResult = await serverService.findServerByPublicId(publicId);
    expect(findResult).toBeNull();
  });
});
