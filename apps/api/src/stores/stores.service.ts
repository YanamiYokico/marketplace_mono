import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export type CreateStoreData = {
  name: string;
  userId: string;
};

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateStoreData): Promise<Store> {
    return this.prisma.store.create({ data });
  }

  findById(id: string): Promise<Store | null> {
    return this.prisma.store.findUnique({ where: { id } });
  }

  findByUserId(userId: string): Promise<Store | null> {
    return this.prisma.store.findUnique({ where: { userId } });
  }

  updateName(id: string, name: string): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data: { name },
    });
  }
}
