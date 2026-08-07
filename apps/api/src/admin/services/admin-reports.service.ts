import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesSummary() {
    const [totalRevenue, totalOrders] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
          },
        },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
    };
  }

  async getTopProducts(limit: number = 5) {
    const topSellingProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
      where: {
        order: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
          },
        },
      },
    });

    const productIds = topSellingProducts.map((p) => p.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        store: {
          select: { name: true },
        },
      },
    });

    // Map the quantities back to the products
    return products.map((product) => {
      const salesData = topSellingProducts.find((p) => p.productId === product.id);
      return {
        ...product,
        totalSold: salesData?._sum.quantity || 0,
      };
    }).sort((a, b) => b.totalSold - a.totalSold);
  }
}
