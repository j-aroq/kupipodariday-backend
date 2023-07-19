import { Controller, Get, Param, Body, Req, Post } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';

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
