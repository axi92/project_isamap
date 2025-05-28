import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationService } from "./configuration.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ERROR_CONFIG_NOT_LOADED, WARN_CONFIG_EMPTY } from "./configuration.constants";
import { Logger } from "@nestjs/common";

describe("ConfigurationServiceWithMissingConfig", () => {
  let mockConfigService: Partial<ConfigService>;
  let loggerSpyWarn: jest.SpyInstance;
  let loggerSpyError: jest.SpyInstance;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue(undefined), // Simulate missing config values
    };

    // Spy on Logger methods
    loggerSpyWarn = jest.spyOn(Logger.prototype, "warn").mockImplementation();
    loggerSpyError = jest.spyOn(Logger.prototype, "error").mockImplementation();
    expect.hasAssertions();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original Logger methods
  });

  it("should log a warning and an error on empty config", async () => {
    let service: ConfigurationService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    // Check if the warning and error were logged
    expect(loggerSpyWarn).toHaveBeenCalledWith(
      WARN_CONFIG_EMPTY
    );
    expect(loggerSpyError).toHaveBeenCalledWith(
      ERROR_CONFIG_NOT_LOADED
    );
  });
});


describe("ConfigurationServiceWithValidConfig", () => {
  let service: ConfigurationService;
  let mockConfigService: Partial<ConfigService>;
  const clientID = 'mock-client-id'
  const secret = 'mock-client-secret'
  const redirectUri = 'mock-redirect-uri'

  beforeAll(async () => {
    mockConfigService = {
      get: jest.fn(), // Mock the get method to return undefined 
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);

    // Manually set the variables using the set functions
    service.setDiscordClientId(clientID);
    service.setDiscordClientSecret(secret);
    service.setDiscordRedirectUri(redirectUri);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return the correct DISCORD_CLIENT_ID", () => {
    expect(service.getDiscordClientId()).toBe(clientID);
  });

  it("should return the correct DISCORD_CLIENT_SECRET", () => {
    expect(service.getDiscordClientSecret()).toBe(secret);
  });

  it("should return the correct DISCORD_REDIRECT_URI", () => {
    expect(service.getDiscordRedirectUri()).toBe(redirectUri);
  });
});