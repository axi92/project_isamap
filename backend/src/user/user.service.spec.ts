import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDetails } from './user.interface';
import { LowdbService } from '../lowdb/lowdb.service';
import { DB_FILENAME } from '../lowdb/lowdb.constants';
import { testDiscordID1 } from "./user.constants";

describe('UserService', () => {
  let service: UserService;
  let dbService: LowdbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, LowdbService],
    }).compile();

    service = module.get<UserService>(UserService);
    dbService = module.get<LowdbService>(LowdbService);

    // Mock the database initialization
    await dbService.onModuleInit(DB_FILENAME)
    dbService.getDb().data = { users: [], servers: [] }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create a user", async () => {
    const userTemplate = {
      userId: testDiscordID1,
      username: 'username',
      avatar: 'testAvatarString',
      verified: true,
    }
    const userCreated = await service.create(userTemplate)
    expect(userCreated).toMatchObject<UserDetails>(userTemplate);
  })

  it("should create a user and resolve when creating a new one without really creating a new one", async () => {
    const userTemplate: UserDetails = {
      userId: testDiscordID1,
      username: "testuser",
      avatar: "testAvatarString",
      verified: true,
    };

    // Create the first user
    const createdUser = await service.create(userTemplate);
    expect(createdUser).toMatchObject(userTemplate);

    // Attempt to create the same user again and expect rejection
    await expect(service.create(userTemplate)).resolves.toEqual(
      createdUser
    );

    const users = await service.getAll();
    expect(users.length).toBe(1)
  });
});
