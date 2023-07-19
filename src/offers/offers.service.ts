import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { SUM_EXCEEDS_WISH_PRICE } from 'src/utils/constants/wish';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findById(dto.itemId);

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException();
    }

    const totalSum = wish.raised + dto.amount;
    if (totalSum > wish.price) {
      throw new BadRequestException(SUM_EXCEEDS_WISH_PRICE);
    }

    await this.wishesService.updateRaisedAmount(wish.id, totalSum);

    const createdOffer = await this.offerRepository.create({
      ...dto,
      user,
      item: wish,
    });

    await this.offerRepository.save(createdOffer);
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = offer.user;
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['item', 'user'],
    });
  }
}
