import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

type AuthRequest = { user: { userId: string } };

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  toggleFavorite(@Req() req: AuthRequest, @Param('productId') productId: string) {
    return this.favoritesService.toggleFavorite(req.user.userId, productId);
  }

  @Get()
  getFavorites(@Req() req: AuthRequest) {
    return this.favoritesService.getFavorites(req.user.userId);
  }
}
