import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateProductData = {
  name: string;
  price: Prisma.Decimal | number | string;
  rating?: number;
  imageUrl: string;
  storeId: string;
};

export type UpdateProductData = Partial<Omit<CreateProductData, 'storeId'>>;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProductData): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  findByStoreId(storeId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: UpdateProductData): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
