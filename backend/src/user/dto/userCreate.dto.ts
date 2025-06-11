// https://discord.com/developers/docs/resources/user#user-object

import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserCreatDto {
  @IsString()
  @Matches(/^\d+$/)
  @Length(17, 20)
  userId: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsBoolean()
  verified: boolean;
}
