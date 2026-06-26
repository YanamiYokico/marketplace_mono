import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ConfigModule, OrdersModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
