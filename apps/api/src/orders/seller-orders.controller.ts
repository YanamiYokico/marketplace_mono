import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

type AuthRequest = { user: { userId: string } };

@UseGuards(JwtAuthGuard)
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getSellerOrders(@Req() req: AuthRequest) {
    return this.ordersService.getSellerOrders(req.user.userId);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(req.user.userId, id, dto);
  }
}
