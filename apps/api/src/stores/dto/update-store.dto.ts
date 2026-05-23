import { IsString, MinLength } from 'class-validator';

export class UpdateStoreDto {
  @IsString()
  @MinLength(1)
  name: string;
}
