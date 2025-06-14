import { Test, TestingModule } from '@nestjs/testing';
import { LowdbService } from './lowdb.service';
import { UserCreatDto } from '../user/dto/userCreate.dto';
import {
  DB_FILENAME,
  WARN_SAVING_DB_SHUTDOWN,
  WARN_SAVING_DB_SHUTDOWN_COMPLETE,
} from './lowdb.constants';
import { Logger } from '@nestjs/common';
import { ServerService } from '../server/server.service';
import { UserService } from '../user/user.service';
import { ServerEntry } from '../server/server.interface';
import { ServerCreateDto } from '../server/dto/serverCreate.dto';
import { testDiscordID1, userTestTemplate } from '../user/user.constants';

describe('LowdbService', () => {
  let dbService: LowdbService;
  let userService: UserService;
  let serverService: ServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LowdbService, ServerService, UserService],
    }).compile();

    dbService = module.get<LowdbService>(LowdbService);
    userService = module.get<UserService>(UserService);
    serverService = module.get<ServerService>(ServerService);

    // Mock the database initialization
    await dbService.onModuleInit(DB_FILENAME);
    dbService.getDb().data = { users: [], servers: [] };
  });

  it('should be defined', () => {
    expect(dbService).toBeDefined();
  });

  it('get db handle', () => {
    const db = dbService.getDb();
    expect(db).toBeDefined(); // Ensure the db is initialized
  });

  it('should create a server for an existing user', async () => {
    const ownerDiscordId = testDiscordID1;

    const serverDescription = 'Test server description';

    // Step 1: Create the user
    const createdUser = await userService.create(userTestTemplate);
    expect(createdUser).toMatchObject(userTestTemplate);

    const serverCreate: ServerCreateDto = {
      owner: testDiscordID1,
      description: serverDescription,
    };

    // Step 2: Create the server
    const createdServer = (await serverService.create(
      serverCreate,
    )) as ServerEntry;

    // Verify the server creation
    expect(createdServer).toMatchObject({
      owner: ownerDiscordId,
      description: serverDescription,
    } as ServerCreateDto);

    // Ensure the server has valid UUIDs for privateId and publicId
    expect(createdServer.privateId).toBeDefined();
    expect(createdServer.publicId).toBeDefined();
    expect(createdServer.privateId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(createdServer.publicId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('should find a server by its private ID', async () => {
    const serverDescription = 'Test server description';

    // Step 1: Create a user (required for server creation)
    const createdUser = await userService.create(userTestTemplate);
    expect(createdUser).toMatchObject(userTestTemplate);

    const serverCreate: ServerCreateDto = {
      owner: testDiscordID1,
      description: serverDescription,
    };

    // Step 2: Create a server
    const createdServer = (await serverService.create(
      serverCreate,
    )) as ServerEntry;
    expect(createdServer).toBeDefined();
    expect(createdServer.privateId).toBeDefined();

    // Step 3: Find the server by its private ID
    const foundServer = await serverService.findServerByPrivateId(
      createdServer.privateId,
    );

    // Verify the server retrieval
    expect(foundServer).toBeDefined();
    expect(foundServer).toMatchObject({
      owner: testDiscordID1,
      description: serverDescription,
      privateId: createdServer.privateId,
      publicId: createdServer.publicId,
    } as ServerEntry);
  });

  it('should find all servers by its owner when multiple servers exist', async () => {
    const ownerDiscordId = testDiscordID1;
    const serverDescription1 = 'Test server description 1';
    const serverDescription2 = 'Test server description 2';

    // Step 1: Create a user (required for server creation)
    const userTemplate: UserCreatDto = {
      userId: testDiscordID1,
      username: 'testuser',
      avatar: 'testAvatarString',
      verified: true,
    };

    const createdUser = await userService.create(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);

    const serverCreate1: ServerCreateDto = {
      owner: testDiscordID1,
      description: serverDescription1,
    };
    const serverCreate2: ServerCreateDto = {
      owner: testDiscordID1,
      description: serverDescription2,
    };

    // Step 2: Create two servers for the same owner
    const createdServer1 = (await serverService.create(
      serverCreate1,
    )) as ServerEntry;
    const createdServer2 = (await serverService.create(
      serverCreate2,
    )) as ServerEntry;

    expect(createdServer1).toBeDefined();
    expect(createdServer2).toBeDefined();
    expect(createdServer1.owner).toBe(ownerDiscordId);
    expect(createdServer2.owner).toBe(ownerDiscordId);

    // Step 3: Find all servers by their owner
    const foundServers = await serverService.findServersByOwner(ownerDiscordId);

    // Verify the servers retrieval
    expect(foundServers).toBeDefined();
    expect(foundServers).toHaveLength(2); // Ensure two servers are returned
    expect(foundServers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          owner: ownerDiscordId,
          description: serverDescription1,
          privateId: createdServer1.privateId,
          publicId: createdServer1.publicId,
        } as ServerEntry),
        expect.objectContaining({
          owner: ownerDiscordId,
          description: serverDescription2,
          privateId: createdServer2.privateId,
          publicId: createdServer2.publicId,
        } as ServerEntry),
      ]),
    );
  });

  it('should retrieve all entries for users and servers', async () => {
    const serverDescription = 'Test server description';

    // Step 1: Create a user
    const userTemplate: UserCreatDto = {
      userId: testDiscordID1,
      username: 'testuser',
      avatar: 'testAvatarString',
      verified: true,
    };
    const createdUser = await userService.create(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);

    // Step 2: Create a server
    const serverCreateDto: ServerCreateDto = {
      owner: testDiscordID1,
      description: serverDescription,
    };
    const createdServer = (await serverService.create(
      serverCreateDto,
    )) as ServerEntry;
    expect(createdServer).toBeDefined();
    expect(createdServer.owner).toBe(serverCreateDto.owner);

    // Step 3: Retrieve all users
    const allUsers = await userService.getAll();
    expect(allUsers).toBeDefined();
    expect(allUsers).toHaveLength(1); // Ensure one user is returned
    expect(allUsers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: serverCreateDto.owner,
          username: 'testuser',
          avatar: 'testAvatarString',
          verified: true,
        } as UserCreatDto),
      ]),
    );

    // Step 4: Retrieve all servers
    const allServers = await serverService.getAll();
    expect(allServers).toBeDefined();
    expect(allServers).toHaveLength(1); // Ensure one server is returned
    expect(allServers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          owner: serverCreateDto.owner,
          description: serverDescription,
          privateId: createdServer.privateId,
          publicId: createdServer.publicId,
        } as ServerEntry),
      ]),
    );
  });
});

describe('LowdbService - onModuleDestroy', () => {
  let service: LowdbService;
  let loggerSpyWarn: jest.SpyInstance;
  let dbWriteSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LowdbService],
    }).compile();

    service = module.get<LowdbService>(LowdbService);

    // Mock the database initialization
    service['db'] = {
      write: jest.fn(), // Mock the db.write method
    } as never;

    // Spy on Logger.warn
    loggerSpyWarn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    dbWriteSpy = jest.spyOn(service['db'], 'write');
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations
  });

  it('should log two warn messages and call db.write', async () => {
    await service.onModuleDestroy();

    // Check if the two warn messages were logged
    expect(loggerSpyWarn).toHaveBeenCalledWith(WARN_SAVING_DB_SHUTDOWN);
    expect(loggerSpyWarn).toHaveBeenCalledWith(
      WARN_SAVING_DB_SHUTDOWN_COMPLETE,
    );

    // Check if db.write was called
    expect(dbWriteSpy).toHaveBeenCalled();
  });
});
