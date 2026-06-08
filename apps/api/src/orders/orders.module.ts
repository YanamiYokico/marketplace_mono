import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SellerOrdersController } from './seller-orders.controller';

@Module({
  imports: [PrismaModule, CartModule],
  controllers: [OrdersController, SellerOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
