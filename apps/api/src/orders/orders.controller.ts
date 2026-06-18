import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './orders.service';

type AuthRequest = { user: { userId: string } };

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Req() req: AuthRequest, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(req.user.userId, dto);
  }

  @Get()
  getUserOrders(@Req() req: AuthRequest) {
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @Get(':id')
  getOrderById(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.userId, id);
  }

  @Post(':id/pay')
  payOrder(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.ordersService.payOrder(req.user.userId, id);
  }

  @Post(':id/cancel')
  cancelOrder(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.userId, id);
  }
}
