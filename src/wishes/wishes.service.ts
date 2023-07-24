import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import {
  WISH_COPY_NOT_ALLOWED,
  HAS_BEEN_ALREADY_COPIED,
} from 'src/utils/constants/wish';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User) {
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  async findMany(ids: number[]): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(ids) },
    });
  }

  async updateWish(wishId: number, dto: UpdateWishDto, userId: number) {
    const wish = await this.findById(wishId);

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.raised > 0) {
      throw new BadRequestException();
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException();
    }

    await this.wishRepository.update(wishId, dto);
  }

  async removeWish(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findById(wishId);
    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException();
    }

    await this.wishRepository.delete(wishId);

    return wish;
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.wishRepository.findOneBy({ id: wishId });

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(WISH_COPY_NOT_ALLOWED);
    }

    await this.wishRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;

    const wishCopy = {
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
      offers: [],
    };

    const hasSameWish = user.wishes.some(
      (userWish) => userWish.name === wishCopy.name,
    );
    if (hasSameWish) {
      throw new BadRequestException(HAS_BEEN_ALREADY_COPIED);
    }

    await this.create(wishCopy, user);
  }

  async updateRaisedAmount(wishId: number, raised: number) {
    await this.wishRepository.update(wishId, { raised });
  }
}
