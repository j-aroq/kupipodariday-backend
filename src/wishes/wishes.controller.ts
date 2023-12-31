import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishInterceptor } from 'src/utils/interceptors/wish-interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(ThrottlerGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ) {
    return await this.wishesService.create(dto, user);
  }

  @Get('last')
  @UseInterceptors(WishInterceptor)
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('top')
  @UseInterceptors(WishInterceptor)
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishInterceptor)
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findById(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishInterceptor)
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ) {
    return await this.wishesService.updateWish(Number(id), dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishInterceptor)
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.removeWish(Number(id), user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  @UseInterceptors(WishInterceptor)
  async copyWish(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishesService.copyWish(Number(id), user);
  }
}
