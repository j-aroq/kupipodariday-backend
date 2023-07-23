import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  providers: [OffersService],
  controllers: [OffersController],
  imports: [TypeOrmModule.forFeature([Offer]), WishesModule],
})
export class OffersModule {}
