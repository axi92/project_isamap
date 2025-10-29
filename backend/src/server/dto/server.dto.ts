import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

class TribeDTO {
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  tribeid: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  x_pos: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  y_pos: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  x_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  y_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  z_ue4: number;

  @IsString()
  tribename: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  decayDestructionTime: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lastInAllyRangeTime: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  elapsedTime: number;
}

class DinoDTO {
  @IsString()
  class: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  x_pos: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  y_pos: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  x_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  y_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  z_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  id: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  level: number;
}

class PlayerDTO {
  @IsString()
  steamid: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  x_pos: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  y_pos: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  x_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  y_ue4: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  z_ue4: number;

  @IsString()
  playername: string;

  @IsString()
  tribename: string;
}

export class publicIdDTO {
  @IsNotEmpty()
  @IsString()
  publicId: string;
}

export class LiveMapDTO {
  @IsNotEmpty()
  @IsString()
  privateid: string;

  @IsNotEmpty()
  @IsString()
  map: string;

  @IsNotEmpty()
  @IsString()
  servername: string;

  @IsNotEmpty()
  @IsString()
  serverclock: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TribeDTO)
  tribes?: TribeDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DinoDTO)
  dinos?: DinoDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerDTO)
  players?: PlayerDTO[];
}
