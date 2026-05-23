import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

type AuthRequest = { user: { userId: string } };

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMine(@Req() req: AuthRequest) {
    const store = await this.storesService.findByUserId(req.user.userId);
    if (!store) {
      throw new NotFoundException('You do not have a store yet');
    }
    return store;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateStoreDto) {
    const existing = await this.storesService.findByUserId(req.user.userId);
    if (existing) {
      throw new ConflictException('You already have a store');
    }

    try {
      return await this.storesService.create({
        name: dto.name,
        userId: req.user.userId,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('You already have a store');
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMine(@Req() req: AuthRequest, @Body() dto: UpdateStoreDto) {
    const store = await this.storesService.findByUserId(req.user.userId);
    if (!store) {
      throw new NotFoundException('You do not have a store yet');
    }
    return this.storesService.updateName(store.id, dto.name);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const store = await this.storesService.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }
}
