import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from '@/configuration/configuration.service';
import { ConfigService } from '@nestjs/config';
import {
  ENV_VARS,
  ERROR_CONFIG_NOT_LOADED,
  WARN_CONFIG_EMPTY,
} from '@/configuration/configuration.constants';
import { Logger } from '@nestjs/common';

describe('ConfigurationServiceWithMissingConfig', () => {
  let mockConfigService: Partial<ConfigService>;
  let loggerSpyWarn: jest.SpyInstance;
  let loggerSpyError: jest.SpyInstance;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue(undefined), // Simulate missing config values
    };

    // Spy on Logger methods
    loggerSpyWarn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    loggerSpyError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    expect.hasAssertions();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original Logger methods
  });

  it('should log a warning and an error on empty config', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    // Call module to trigger constructor
    module.get<ConfigurationService>(ConfigurationService);
    // Check if the warning and error were logged
    expect(loggerSpyWarn).toHaveBeenCalledWith(WARN_CONFIG_EMPTY);
    expect(loggerSpyError).toHaveBeenCalledWith(ERROR_CONFIG_NOT_LOADED);
  });
});

describe('ConfigurationServiceWithValidConfig', () => {
  let service: ConfigurationService;
  let mockConfigService: Partial<ConfigService>;
  const clientID = 'mock-client-id';
  const secret = 'mock-client-secret';
  const redirectUri = 'mock-redirect-uri';
  const sessionSecret = 'mock-session-secret';

  beforeAll(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const mockConfig = {
          [ENV_VARS.DISCORD_CLIENT_ID]: clientID,
          [ENV_VARS.DISCORD_CLIENT_SECRET]: secret,
          [ENV_VARS.DISCORD_REDIRECT_URI]: redirectUri,
          [ENV_VARS.SESSION_SECRET]: sessionSecret,
        };
        return mockConfig[key];
      }), // Mock the get method to return
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
    service.setSessionSecret(sessionSecret);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct DISCORD_CLIENT_ID', () => {
    expect(service.getDiscordClientId()).toBe(clientID);
  });

  it('should return the correct DISCORD_CLIENT_SECRET', () => {
    expect(service.getDiscordClientSecret()).toBe(secret);
  });

  it('should return the correct DISCORD_REDIRECT_URI', () => {
    expect(service.getDiscordRedirectUri()).toBe(redirectUri);
  });

  it('should return the correct SESSION_SECRET', () => {
    expect(service.getSessionSecret()).toBe(sessionSecret);
  });
});
