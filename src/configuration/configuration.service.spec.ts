import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationService } from "./configuration.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  AUTH_CLIENT,
  AUTH_ENDPOINT,
  AUTH_SECRET,
  AUTH_TENANT,
  AUTH_VALIDITY,
  AuthClientModule,
  AuthClientModuleOptions,
} from "@evva/nest-auth-client";

describe("ConfigurationService", () => {
  let service: ConfigurationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: [".env.test"] }),
        AuthClientModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            ({
              authEndpoint: configService.get<string>(AUTH_ENDPOINT),
              authTenant: configService.get<string>(AUTH_TENANT),
              authClientId: configService.get<string>(AUTH_CLIENT),
              authClientSecret: configService.get<string>(AUTH_SECRET),
              authValidity: parseInt(configService.get(AUTH_VALIDITY)), // in seconds, see spec
            }) as AuthClientModuleOptions,
        }),
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

  it("should return getMqttPort", () => {
    expect(typeof service.getMqttPort()).toBe("number");
  });

  it("should return getMqttTopicBase", () => {
    expect(typeof service.getMqttTopicBase()).toBe("string");
  });

  it("should return getRobotHost", () => {
    expect(typeof service.getRobotHost()).toBe("string");
  });

  it("should return getRobotPort", () => {
    expect(typeof service.getRobotPort()).toBe("number");
  });

  it("should return getReaderTerminal", () => {
    expect(typeof service.getReaderTerminal()).toBe("string");
  });
});
