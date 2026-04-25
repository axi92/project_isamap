import { Test, TestingModule } from '@nestjs/testing';
import { ServerService } from './server.service';
import { LowdbService } from '@/lowdb/lowdb.service';
import { UserService } from '@/user/user.service';
import { exampleServerData, serverCreateTestData } from './server.test.data';
import { DB_FILENAME } from '@/lowdb/lowdb.constants';
import { userTestTemplate } from '@/user/user.constants';
import { ServerEntry, ServerInfo } from './server.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ERROR_INVALID_OWNER, MAX_SERVERS_PER_USER } from './server.constants';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { UserCreatDto } from '@/user/dto/userCreate.dto';

describe('ServerService', () => {
  let serverService: ServerService;
  let userService: UserService;
  let dbService: LowdbService;
  let serverEntry: ServerEntry;

  async function clearDatabase() {
    // Clear the database by resetting chain data and writing to disk
    const db = dbService.getDb();
    db.data = { users: [], servers: [] };
    // Re-initialize the chain with the new data
    await db.initializeChain();
    await dbService.forceWriteToDisk();
  }

  async function forceWriteToDisk() {
    await dbService.forceWriteToDisk();
  }

  function isServerEntry(
    entry: ServerEntry | BadRequestException,
  ): entry is ServerEntry {
    return (entry as ServerEntry).privateId !== undefined;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerService, LowdbService, UserService],
    }).compile();

    serverService = module.get<ServerService>(ServerService);
    userService = module.get<UserService>(UserService);
    dbService = module.get<LowdbService>(LowdbService);

    // Mock the database initialization
    await dbService.onModuleInit(DB_FILENAME);

    // Clear the database for fresh test state
    await clearDatabase();

    // Create initial user
    await userService.create(userTestTemplate);
    // Force write to ensure database is clean
    await forceWriteToDisk();
  });

  it('should be defined', () => {
    expect(serverService).toBeDefined();
  });

  it('get server data by false publicId and result should be null', () => {
    // Give false id, it does not matter because there is no data yet
    const data = serverService.getServerDataByPublicId(
      exampleServerData.privateid,
    );
    expect(data).toBeNull();
  });

  it('handle incoming livemap data with no matching server entry', async () => {
    const data = await serverService.processData(exampleServerData);
    expect(data).toBeFalsy();
  });

  it('handle livemap data with success', async () => {
    // Create server entry to test with
    serverEntry = (await serverService.create(
      serverCreateTestData,
    )) as ServerEntry;
    exampleServerData.privateid = serverEntry.privateId;
    await forceWriteToDisk();

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
    const user = await userService.create({
      userId: 'delete-test-user',
      username: 'DeleteTestUser',
      verified: false,
      avatar: 'avatar.png',
    } as UserCreatDto);

    // Create a server for created owner
    const entry = await serverService.create({
      owner: user.userId,
      description: 'Test server for delete',
    } as ServerCreateDto);
    await forceWriteToDisk();

    expect((entry as ServerEntry).owner).toBe(user.userId);

    const publicId = (entry as ServerEntry).publicId;

    // Delete it
    const result = await serverService.delete(publicId);
    expect(result).toBe(true);

    // Verify it's gone
    const findResult = await serverService.findServerByPublicId(publicId);
    expect(findResult).toBeNull();
  });

  it('should write server entry to SERVERS collection, not USERS collection', async () => {
    // Get initial state of both collections
    const initialUsers = await userService.getAll();
    const initialServers = await serverService.getAll();
    const initialServersCount = initialServers.length;

    // Create a server
    await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Test server for collection isolation',
    } as ServerCreateDto);
    await forceWriteToDisk();

    // Get final state of both collections
    const finalUsers = await userService.getAll();
    const finalServers = await serverService.getAll();

    // Verify USERS collection was NOT modified
    expect(finalUsers).toEqual(initialUsers);

    // Verify SERVERS collection contains the new entry
    expect(finalServers.length).toBe(initialServersCount + 1);
    expect(finalServers[finalServers.length - 1]).toMatchObject({
      owner: userTestTemplate.userId,
      description: 'Test server for collection isolation',
    });
  });

  it('should get all servers', async () => {
    // Create multiple servers
    const server1 = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server 1',
    } as ServerCreateDto);
    const server2 = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server 2',
    } as ServerCreateDto);
    await forceWriteToDisk();

    const allServers = await serverService.getAll();

    expect(allServers).toHaveLength(2);
    expect(allServers).toContainEqual(server1);
    expect(allServers).toContainEqual(server2);
  });

  it('should find server by private id', async () => {
    // Create a server
    const entryResult = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Test server for private id',
    } as ServerCreateDto);
    await forceWriteToDisk();

    if (!isServerEntry(entryResult)) {
      throw new Error('Expected ServerEntry but got BadRequestException');
    }
    const entry = entryResult;

    const found = await serverService.findServerByPrivateId(entry.privateId);

    expect(found).not.toBeNull();
    expect(found!.privateId).toBe(entry.privateId);
    expect(found!.publicId).toBe(entry.publicId);
  });

  it('should return null when finding server by non-existent private id', async () => {
    const result = await serverService.findServerByPrivateId(
      'non-existent-private-id',
    );

    expect(result).toBeNull();
  });

  it('should get servers by owner', async () => {
    // Create another user
    const user2 = await userService.create({
      userId: 'get-by-owner-test-user-2',
      username: 'User2',
      verified: false,
      avatar: 'avatar2.png',
    } as UserCreatDto);

    // Create servers for user1
    const server1 = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server 1 for user1',
    } as ServerCreateDto);
    const server2 = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server 2 for user1',
    } as ServerCreateDto);

    // Create server for user2
    const server3 = await serverService.create({
      owner: user2.userId,
      description: 'Server 1 for user2',
    } as ServerCreateDto);
    await forceWriteToDisk();

    const serversForUser1 = await serverService.getByOwner(
      userTestTemplate.userId,
    );
    const serversForUser2 = await serverService.getByOwner(user2.userId);

    expect(serversForUser1).toHaveLength(2);
    // Use toMatchObject since ServerInfo doesn't include owner/privateId
    expect(serversForUser1[0]).toMatchObject({
      description: 'Server 1 for user1',
    });
    expect(serversForUser1[1]).toMatchObject({
      description: 'Server 2 for user1',
    });

    expect(serversForUser2).toHaveLength(1);
    expect(serversForUser2[0]).toMatchObject({
      description: 'Server 1 for user2',
    });
  });

  it('should return empty array when getting servers for non-existent owner', async () => {
    const servers = await serverService.getByOwner('non-existent-user');

    expect(servers).toEqual([]);
  });

  it('should get all servers for admin with user data merged', async () => {
    // Create servers
    await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Admin test server',
    } as ServerCreateDto);
    await forceWriteToDisk();

    const adminServers = await serverService.getAllForAdmin();

    expect(adminServers).toHaveLength(1);
    expect(adminServers[0]).toMatchObject({
      ownerUserId: userTestTemplate.userId,
      description: 'Admin test server',
    });
    // Should have ownerUsername since user exists
    expect(adminServers[0]).toHaveProperty('ownerUsername');
  });

  it('should process livemap data successfully', async () => {
    // Create a server first
    const entryResult = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server for data processing',
    } as ServerCreateDto);
    await forceWriteToDisk();

    if (!isServerEntry(entryResult)) {
      throw new Error('Expected ServerEntry but got BadRequestException');
    }
    const entry = entryResult;
    exampleServerData.privateid = entry.privateId;

    const result = await serverService.processData(exampleServerData);

    expect(result).toBe(true);
  });

  it('should return false when processing data for non-existent server', async () => {
    const result = await serverService.processData(exampleServerData);

    expect(result).toBe(false);
  });

  it('should return server data by public id after processing', async () => {
    // Create a server
    const entryResult = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server for data retrieval',
    } as ServerCreateDto);
    await forceWriteToDisk();

    if (!isServerEntry(entryResult)) {
      throw new Error('Expected ServerEntry but got BadRequestException');
    }
    const entry = entryResult;

    // Process data
    const processDataDto = {
      ...exampleServerData,
      privateid: entry.privateId,
    };
    await serverService.processData(processDataDto);

    // Get data by public id
    const data = serverService.getServerDataByPublicId(entry.publicId);

    expect(data).not.toBeNull();
    expect(data?.servername).toBe('Test Server');
    expect(data?.map).toBe('TheIsland');
    expect(data?.players).toHaveLength(1);
  });

  it('should return calibration fixture data for fixture_ prefixed ids', () => {
    const data = serverService.getServerDataByPublicId('fixtures_TheIsland');

    expect(data).not.toBeNull();
    expect(data?.map).toBe('TheIsland');
    expect(data?.servername).toBe('Calibration Server');
  });

  it('should return null for non-existent public id', () => {
    const data = serverService.getServerDataByPublicId('non-existent-id');

    expect(data).toBeNull();
  });

  it('should strip privateid from returned data', async () => {
    // Create a server
    const entryResult = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server to check privateid strip',
    } as ServerCreateDto);
    await forceWriteToDisk();

    if (!isServerEntry(entryResult)) {
      throw new Error('Expected ServerEntry but got BadRequestException');
    }
    const entry = entryResult;

    // Process data
    const testData = {
      ...exampleServerData,
      privateid: entry.privateId,
    };
    await serverService.processData(testData);

    // Get data by public id
    const data = serverService.getServerDataByPublicId(entry.publicId);

    expect(data).not.toBeNull();
    expect((data as any).privateid).toBeUndefined();
  });

  it('should apply server limit when creating servers', async () => {
    // Create servers up to the limit
    for (let i = 0; i < MAX_SERVERS_PER_USER; i++) {
      await serverService.create({
        owner: userTestTemplate.userId,
        description: `Server ${i + 1}`,
      } as ServerCreateDto);
    }

    // Try to create one more server - should fail
    await expect(
      serverService.create({
        owner: userTestTemplate.userId,
        description: 'Server over limit',
      } as ServerCreateDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should clear server data after deleting the server', async () => {
    // Create and process data
    const entryResult = await serverService.create({
      owner: userTestTemplate.userId,
      description: 'Server to delete',
    } as ServerCreateDto);
    await forceWriteToDisk();

    if (!isServerEntry(entryResult)) {
      throw new Error('Expected ServerEntry but got BadRequestException');
    }
    const entry = entryResult;

    // Process data with the correct private id
    const processDataDto = {
      ...exampleServerData,
      privateid: entry.privateId,
    };
    await serverService.processData(processDataDto);

    // Data should exist before delete
    const data = serverService.getServerDataByPublicId(entry.publicId);
    expect(data).not.toBeNull();

    // Delete the server
    await serverService.delete(entry.publicId);

    // Data should still exist in memory (it's a map, not cleared on delete)
    // but findServerByPublicId should return null
    const found = await serverService.findServerByPublicId(entry.publicId);
    expect(found).toBeNull();
  });
});
