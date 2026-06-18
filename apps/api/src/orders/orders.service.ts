import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmount = 0;
    const orderItemsData = cart.items.map((item) => {
      const price = Number(item.product.price);
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        storeId: item.product.storeId,
        quantity: item.quantity,
        price,
      };
    });

    const order = await this.prisma.$transaction(async (tx) => {
      // Reserve stock atomically: the `stock >= quantity` guard means a
      // concurrent checkout can never push stock negative (no oversell).
      for (const item of cart.items) {
        const reserved = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (reserved.count === 0) {
          throw new BadRequestException(
            `Not enough stock for ${item.product.name}`,
          );
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          shippingAddress: dto.shippingAddress,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async payOrder(userId: string, orderId: string) {
    const order = await this.getOrderById(userId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in PENDING status');
    }

    // Stock was already reserved at checkout, so paying just advances status.
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.getOrderById(userId, orderId);

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PAID
    ) {
      throw new BadRequestException(
        `Cannot cancel an order with status ${order.status}`,
      );
    }

    // Release the stock reserved at checkout, then mark the order cancelled.
    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }

  async getSellerOrders(sellerUserId: string) {
    const store = await this.prisma.store.findUnique({
      where: { userId: sellerUserId },
    });

    if (!store) {
      throw new BadRequestException('User does not have a store');
    }

    return this.prisma.orderItem.findMany({
      where: { storeId: store.id },
      include: {
        order: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(sellerUserId: string, orderId: string, dto: UpdateOrderStatusDto) {
    const store = await this.prisma.store.findUnique({
      where: { userId: sellerUserId },
    });

    if (!store) {
      throw new BadRequestException('User does not have a store');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Order status is global, so a seller may only change it when the whole
    // order belongs to their store — not when they own just one of several items.
    const ownsEntireOrder =
      order.items.length > 0 &&
      order.items.every((item) => item.storeId === store.id);
    if (!ownsEntireOrder) {
      throw new ForbiddenException(
        'You can only update orders that contain only your store products',
      );
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });
  }
}
