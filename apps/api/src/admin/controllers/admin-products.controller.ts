import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdminProductsService } from '../services/admin-products.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRole, ProductStatus } from '@prisma/client';
import { UpdateProductStatusDto } from '../dto/update-product-status.dto';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: ProductStatus,
  ) {
    return this.adminProductsService.findAll(page, limit, status);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
  ) {
    return this.adminProductsService.updateStatus(id, updateProductStatusDto.status);
  }
}
