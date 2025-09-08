import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { LowdbService } from '@/lowdb/lowdb.service';
import { UserService } from '@/user/user.service';
import { LiveMapDTO, privateIdDTO } from './dto/server.dto';
import { exampleServerData } from './server.test.data';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ServerEntry } from './server.interface';
import { NotFoundException } from '@nestjs/common';
import { ServerCreateDto } from './dto/serverCreate.dto';

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

  it('should return all servers from service', async () => {
    const mockServers = [
      { privateId: '1', publicId: '1', owner: 'Player1' },
      { privateId: '2', publicId: '2', owner: 'Player2' },
    ] as ServerEntry[];
    jest.spyOn(serverService, 'getAll').mockResolvedValueOnce(mockServers);

    const result = await controller.allServers();
    expect(result).toEqual(mockServers);
    expect(serverService.getAll).toHaveBeenCalledTimes(1);
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
    jest
      .spyOn(serverService, 'getServerDataByPublicId')
      .mockReturnValueOnce(exampleServerData);
    const result = controller.getData('publicId123');
    expect(result).toEqual(exampleServerData);
    expect(serverService.getServerDataByPublicId).toHaveBeenCalledWith(
      'publicId123',
    );
  });

  it('should throw NotFoundException if getServerDataByPublicId returns null', () => {
    jest
      .spyOn(serverService, 'getServerDataByPublicId')
      .mockReturnValueOnce(null);
    expect(() => controller.getData('publicId123')).toThrow(NotFoundException);
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
    jest.spyOn(serverService, 'create').mockResolvedValueOnce(mockResult);
    const result = await controller.createServer(serverCreateDto);
    expect(result).toEqual(mockResult);
    expect(serverService.create).toHaveBeenCalledWith(serverCreateDto);
  });

  it('should delete a server and return undefined if successful', async () => {
    jest.spyOn(serverService, 'delete').mockResolvedValueOnce(true);
    const request = { privateid: 'privId' } as privateIdDTO;
    const result = await controller.deleteServer(request);
    expect(result).toBeUndefined();
    expect(serverService.delete).toHaveBeenCalledWith('privId');
  });

  it('should throw NotFoundException if delete returns false', async () => {
    jest.spyOn(serverService, 'delete').mockResolvedValueOnce(false);
    const request = { privateid: 'privId' } as privateIdDTO;
    await expect(controller.deleteServer(request)).rejects.toThrow(
      NotFoundException,
    );
  });
});
