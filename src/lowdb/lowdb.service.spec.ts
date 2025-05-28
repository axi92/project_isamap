import { Test, TestingModule } from "@nestjs/testing";
import { LowdbService } from "./lowdb.service";
import { DataBaseStructure, UserDetails } from "./lowdb.interface";
import { JSONFile } from "lowdb/node";
import { LowWithLodash } from "./lowWithLodash";

describe("LowdbService", () => {
  let service: LowdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LowdbService],
    }).compile();

    service = module.get<LowdbService>(LowdbService);

    // Mock the database initialization
    const adapter = new JSONFile<DataBaseStructure>("test-db.json");
    service["db"] = new LowWithLodash(adapter, { users: [], servers: [] });
    await service["db"].read();
    await service["db"].initializeChain();
    // Erase data before each test
    service["db"].data = { users: [], servers: [] }
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
});
