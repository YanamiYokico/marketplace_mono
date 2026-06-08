import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(`Not enough stock for product ${product?.name}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
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

    const hasSellerItem = order.items.some((item) => item.storeId === store.id);
    if (!hasSellerItem) {
      throw new BadRequestException('You do not have permission to update this order');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });
  }
}
