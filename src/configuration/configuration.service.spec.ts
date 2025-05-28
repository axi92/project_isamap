import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationService } from "./configuration.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

describe("ConfigurationService", () => {
  let service: ConfigurationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: [".env.test"] }),
      ],
      providers: [ConfigurationService],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  beforeEach(async () => {
    expect.hasAssertions();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return MqttHost", () => {
    expect(typeof service.getMqttHost()).toBe("string");
  });
});
