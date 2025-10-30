import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class ServerCreateDto {
  @IsString()
  @Matches(/^\d+$/)
  @Length(17, 20)
  owner: string;

  @IsOptional()
  @IsString()
  @Length(0, 64)
  description?: string;
}
