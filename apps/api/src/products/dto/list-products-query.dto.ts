import { IsUUID } from 'class-validator';

export class ListProductsQueryDto {
  @IsUUID()
  storeId: string;
}
