import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { USER_ALREADY_EXISTS } from 'src/utils/constants/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const doesUserExist =
      (await this.findByEmail(createUserDto.email)) ||
      (await this.findByUsername(createUserDto.username));

    if (doesUserExist) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    return this.userRepository.save({
      ...createUserDto,
      password: await this.hashService.getHashAsync(createUserDto.password),
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.password) {
      dto.password = await this.hashService.getHashAsync(dto.password);
    }

    const updatedUser: User = {
      ...user,
      password: dto?.password,
      email: dto?.email,
      about: dto?.about,
      username: dto?.username,
      avatar: dto?.avatar,
    };
    await this.userRepository.update(user.id, updatedUser);

    return await this.findById(id);
  }

  async removeUser(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.delete(id);

    return user;
  }

  async findUser(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });

    return users;
  }

  async getWishes(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
      relationLoadStrategy: 'join',
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
}
