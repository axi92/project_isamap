import { Test, TestingModule } from "@nestjs/testing";
import { LowdbService } from "./lowdb.service";
import { UserDetails } from "./lowdb.interface";
import { ERROR_USER_EXISTS, WARN_SAVING_DB_SHUTDOWN, WARN_SAVING_DB_SHUTDOWN_COMPLETE } from "./lowdb.constants";
import { Logger } from "@nestjs/common";

const DB_FILENAME = "test-db.json"

describe("LowdbService", () => {
  let service: LowdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LowdbService],
    }).compile();

    service = module.get<LowdbService>(LowdbService);

    // Mock the database initialization
    await service.onModuleInit(DB_FILENAME)
    service.getDb().data = { users: [], servers: [] }
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it('get db handle', () => {
    const db = service.getDb();
    expect(db).toBeDefined(); // Ensure the db is initialized
  })

  it("should create a user", async () => {
    const userTemplate = {
      discordId: 0,
      username: 'username',
      avatar: 'testAvatarString',
      verified: true,
    }
    const userCreated = await service.creatUser(userTemplate)
    expect(userCreated).toMatchObject<UserDetails>(userTemplate);
  })

  it("should create a user and reject when creating the same user again", async () => {
    const userTemplate: UserDetails = {
      discordId: 1,
      username: "testuser",
      avatar: "testAvatarString",
      verified: true,
    };

    // Create the first user
    const createdUser = await service.creatUser(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);

    // Attempt to create the same user again and expect rejection
    await expect(service.creatUser(userTemplate)).rejects.toEqual(
      ERROR_USER_EXISTS
    );
  });

  it("should create a server for an existing user", async () => {
    const ownerDiscordId = 1;
    const userTemplate: UserDetails = {
      discordId: ownerDiscordId,
      username: "testuser",
      avatar: "testAvatarString",
      verified: true,
    };
  
    const serverDescription = "Test server description";
  
    // Step 1: Create the user
    const createdUser = await service.creatUser(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);
  
    // Step 2: Create the server
    const createdServer = await service.creatServer(ownerDiscordId, serverDescription);
  
    // Verify the server creation
    expect(createdServer).toMatchObject({
      owner: ownerDiscordId,
      description: serverDescription,
    });
  
    // Ensure the server has valid UUIDs for privateId and publicId
    expect(createdServer.privateId).toBeDefined();
    expect(createdServer.publicId).toBeDefined();
    expect(createdServer.privateId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(createdServer.publicId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("should find a server by its private ID", async () => {
    const ownerDiscordId = 1;
    const serverDescription = "Test server description";
  
    // Step 1: Create a user (required for server creation)
    const userTemplate: UserDetails = {
      discordId: ownerDiscordId,
      username: "testuser",
      avatar: "testAvatarString",
      verified: true,
    };
    const createdUser = await service.creatUser(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);
  
    // Step 2: Create a server
    const createdServer = await service.creatServer(ownerDiscordId, serverDescription);
    expect(createdServer).toBeDefined();
    expect(createdServer.privateId).toBeDefined();
  
    // Step 3: Find the server by its private ID
    const foundServer = await service.findServerByPrivateId(createdServer.privateId);
  
    // Verify the server retrieval
    expect(foundServer).toBeDefined();
    expect(foundServer).toMatchObject({
      owner: ownerDiscordId,
      description: serverDescription,
      privateId: createdServer.privateId,
      publicId: createdServer.publicId,
    });
  });

  it("should find all servers by its owner when multiple servers exist", async () => {
    const ownerDiscordId = 1;
    const serverDescription1 = "Test server description 1";
    const serverDescription2 = "Test server description 2";
  
    // Step 1: Create a user (required for server creation)
    const userTemplate: UserDetails = {
      discordId: ownerDiscordId,
      username: "testuser",
      avatar: "testAvatarString",
      verified: true,
    };
    const createdUser = await service.creatUser(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);
  
    // Step 2: Create two servers for the same owner
    const createdServer1 = await service.creatServer(ownerDiscordId, serverDescription1);
    const createdServer2 = await service.creatServer(ownerDiscordId, serverDescription2);
  
    expect(createdServer1).toBeDefined();
    expect(createdServer2).toBeDefined();
    expect(createdServer1.owner).toBe(ownerDiscordId);
    expect(createdServer2.owner).toBe(ownerDiscordId);
  
    // Step 3: Find all servers by their owner
    const foundServers = await service.findServersByOwner(ownerDiscordId);
  
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
        }),
        expect.objectContaining({
          owner: ownerDiscordId,
          description: serverDescription2,
          privateId: createdServer2.privateId,
          publicId: createdServer2.publicId,
        }),
      ])
    );
  });

  it("should retrieve all entries for users and servers", async () => {
    const ownerDiscordId = 1;
    const serverDescription = "Test server description";
  
    // Step 1: Create a user
    const userTemplate: UserDetails = {
      discordId: ownerDiscordId,
      username: "testuser",
      avatar: "testAvatarString",
      verified: true,
    };
    const createdUser = await service.creatUser(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);
  
    // Step 2: Create a server
    const createdServer = await service.creatServer(ownerDiscordId, serverDescription);
    expect(createdServer).toBeDefined();
    expect(createdServer.owner).toBe(ownerDiscordId);
  
    // Step 3: Retrieve all users
    const allUsers = await service.getAllEntries("users");
    expect(allUsers).toBeDefined();
    expect(allUsers).toHaveLength(1); // Ensure one user is returned
    expect(allUsers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          discordId: ownerDiscordId,
          username: "testuser",
          avatar: "testAvatarString",
          verified: true,
        }),
      ])
    );
  
    // Step 4: Retrieve all servers
    const allServers = await service.getAllEntries("servers");
    expect(allServers).toBeDefined();
    expect(allServers).toHaveLength(1); // Ensure one server is returned
    expect(allServers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          owner: ownerDiscordId,
          description: serverDescription,
          privateId: createdServer.privateId,
          publicId: createdServer.publicId,
        }),
      ])
    );
  });

});

describe("LowdbService - onModuleDestroy", () => {
  let service: LowdbService;
  let loggerSpyWarn: jest.SpyInstance;
  let dbWriteSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LowdbService],
    }).compile();

    service = module.get<LowdbService>(LowdbService);

    // Mock the database initialization
    service["db"] = {
      write: jest.fn(), // Mock the db.write method
    } as any;

    // Spy on Logger.warn
    loggerSpyWarn = jest.spyOn(Logger.prototype, "warn").mockImplementation();
    dbWriteSpy = jest.spyOn(service["db"], "write");
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations
  });

  it("should log two warn messages and call db.write", async () => {
    await service.onModuleDestroy();

    // Check if the two warn messages were logged
    expect(loggerSpyWarn).toHaveBeenCalledWith(WARN_SAVING_DB_SHUTDOWN);
    expect(loggerSpyWarn).toHaveBeenCalledWith(WARN_SAVING_DB_SHUTDOWN_COMPLETE);

    // Check if db.write was called
    expect(dbWriteSpy).toHaveBeenCalled();
  });
});