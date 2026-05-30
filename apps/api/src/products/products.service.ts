import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  FindCatalogParams,
  ProductsPageResult,
} from './products.types';

export type CreateProductData = {
  name: string;
  price: Prisma.Decimal | number | string;
  rating?: number;
  imageUrl: string;
  storeId: string;
  categoryId?: string;
};

export type UpdateProductData = Partial<Omit<CreateProductData, 'storeId'>>;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

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

  findCatalog(params: FindCatalogParams): Promise<ProductsPageResult> {
    const page = params.page ?? DEFAULT_PAGE;
    const limit = params.limit ?? DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (params.categoryId) {
      where.category = { is: { id: params.categoryId } };
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {
        ...(params.minPrice !== undefined && { gte: params.minPrice }),
        ...(params.maxPrice !== undefined && { lte: params.maxPrice }),
      };
    }

    const sortBy = params.sortBy ?? 'rating';
    const sortOrder = params.sortOrder ?? 'desc';
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === 'price' ? { price: sortOrder } : { rating: sortOrder };

    return this.prisma.$transaction(async (tx) => {
      const [data, total] = await Promise.all([
        tx.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        tx.product.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        totalPages: total === 0 ? 1 : Math.ceil(total / limit),
      };
    });
  }

  update(id: string, data: UpdateProductData): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
