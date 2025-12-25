import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { LowdbService } from '@/lowdb/lowdb.service';
import { UserService } from '@/user/user.service';
import { LiveMapDTO, publicIdDTO } from './dto/server.dto';
import { exampleServerData } from './server.test.data';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ServerEntry } from './server.interface';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { Request } from 'express';

describe('ServerController', () => {
  let controller: ServerController;
  let serverService: ServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerService, LowdbService, UserService],
    }).compile();

    controller = module.get<ServerController>(ServerController);
    serverService = module.get<ServerService>(ServerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(serverService).toBeDefined();
  });

  it('should pass the validation on the LiveMapDTO', async () => {
    const dto = plainToInstance(LiveMapDTO, exampleServerData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should process data and return undefined if response is not null', async () => {
    jest.spyOn(serverService, 'processData').mockResolvedValueOnce(undefined);
    const dto = plainToInstance(LiveMapDTO, exampleServerData);
    const result = await controller.processData(dto);
    expect(result).toBeUndefined();
    expect(serverService.processData).toHaveBeenCalledWith(dto);
  });

  it('should throw NotFoundException if processData returns null', async () => {
    jest.spyOn(serverService, 'processData').mockResolvedValueOnce(null);
    const dto = plainToInstance(LiveMapDTO, exampleServerData);
    await expect(controller.processData(dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get data by public id and return response', () => {
    const id = { publicId: 'fixture_publicId123' } as publicIdDTO;
    jest
      .spyOn(serverService, 'getServerDataByPublicId')
      .mockReturnValueOnce(exampleServerData);
    const result = controller.getData(id);
    expect(result).toEqual(exampleServerData);
    expect(serverService.getServerDataByPublicId).toHaveBeenCalledWith(
      id.publicId,
    );
  });

  it('should throw NotFoundException if getServerDataByPublicId returns null', () => {
    const id = { publicId: 'fixture_publicId123' } as publicIdDTO;
    jest
      .spyOn(serverService, 'getServerDataByPublicId')
      .mockReturnValueOnce(null);
    expect(() => controller.getData(id)).toThrow(NotFoundException);
  });

  it('should create a server and return result', async () => {
    const serverCreateDto = {
      description: 'desc',
      owner: 'owner',
    } as ServerCreateDto;
    const mockResult = {
      owner: serverCreateDto.owner,
      publicId: 'pub',
      privateId: 'priv',
      description: serverCreateDto.description,
    } as ServerEntry;
    const mockReq = {
      user: { userId: 'owner' },
      isAuthenticated: jest.fn().mockReturnValue(true),
    } as unknown as Request;
    jest.spyOn(serverService, 'create').mockResolvedValueOnce(mockResult);
    const result = await controller.createServer(serverCreateDto, mockReq);
    expect(result).toEqual(mockResult);
    expect(serverService.create).toHaveBeenCalledWith(serverCreateDto);
  });

  it('should throw ForbiddenException if user mismatch on createServer', async () => {
    const serverCreateDto = {
      description: 'desc',
      owner: 'owner',
    } as ServerCreateDto;
    const mockReq = {
      user: { userId: 'anotherUser' },
      isAuthenticated: jest.fn().mockReturnValue(true),
    } as unknown as Request;
    await expect(
      controller.createServer(serverCreateDto, mockReq),
    ).rejects.toThrow(ForbiddenException);
  });
});
