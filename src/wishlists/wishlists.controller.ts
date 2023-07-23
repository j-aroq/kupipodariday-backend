import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { WishInterceptor } from 'src/utils/interceptors/wish-interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@UseGuards(ThrottlerGuard)
@UseInterceptors(WishInterceptor)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @Post()
  async createWishlist(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(dto, user);
  }

  @Get(':id')
  async getWishlistById(@Param('id') wishId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findById(Number(wishId));
    return wishlist;
  }

  @Patch(':id')
  async updateWishlist(
    @Req() { user }: { user: User },
    @Param('id') wishId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishList(
      Number(wishId),
      dto,
      user.id,
    );
  }

  @Delete(':id')
  async deleteWishlist(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeWishList(id, user.id);
  }
}
