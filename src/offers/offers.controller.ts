import {
  Controller,
  Get,
  Param,
  Body,
  Req,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@UseGuards(ThrottlerGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(
    @Body() dto: CreateOfferDto,
    @Req() { user }: { user: User },
  ) {
    return await this.offersService.create(dto, user);
  }

  @Get()
  async getAllOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: string): Promise<Offer> {
    return await this.offersService.findById(Number(id));
  }
}
