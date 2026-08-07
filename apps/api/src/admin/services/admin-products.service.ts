import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, status?: ProductStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: {
            select: { name: true },
          },
          category: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, status: ProductStatus) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { status },
    });
  }
}
