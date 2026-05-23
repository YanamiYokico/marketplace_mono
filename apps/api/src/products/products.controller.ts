import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoresService } from '../stores/stores.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

type AuthRequest = { user: { userId: string } };

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
  ) {}

  @Get()
  findByStore(@Query() query: ListProductsQueryDto) {
    return this.productsService.findByStoreId(query.storeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateProductDto) {
    const store = await this.storesService.findByUserId(req.user.userId);
    if (!store) {
      throw new ForbiddenException('Create a store before adding products');
    }

    return this.productsService.create({
      name: dto.name,
      price: dto.price,
      rating: dto.rating,
      imageUrl: dto.imageUrl,
      storeId: store.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    await this.assertProductOwner(req.user.userId, id);
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: AuthRequest, @Param('id') id: string) {
    await this.assertProductOwner(req.user.userId, id);
    return this.productsService.delete(id);
  }

  private async assertProductOwner(userId: string, productId: string) {
    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const store = await this.storesService.findByUserId(userId);
    if (!store || store.id !== product.storeId) {
      throw new ForbiddenException('You can only manage your own products');
    }
  }
}
