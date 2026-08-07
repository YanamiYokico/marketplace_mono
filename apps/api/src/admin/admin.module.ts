import { Module } from '@nestjs/common';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminProductsController } from './controllers/admin-products.controller';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminUsersService } from './services/admin-users.service';
import { AdminProductsService } from './services/admin-products.service';
import { AdminReportsService } from './services/admin-reports.service';

@Module({
  imports: [],
  controllers: [AdminUsersController, AdminProductsController, AdminReportsController],
  providers: [AdminUsersService, AdminProductsService, AdminReportsService],
})
export class AdminModule {}
