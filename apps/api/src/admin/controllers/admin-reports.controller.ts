import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdminReportsService } from '../services/admin-reports.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get('sales-summary')
  getSalesSummary() {
    return this.adminReportsService.getSalesSummary();
  }

  @Get('top-products')
  getTopProducts(
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.adminReportsService.getTopProducts(limit);
  }
}
