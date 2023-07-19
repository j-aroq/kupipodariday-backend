import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Controller, Get, Body, Patch, Req, Post, Param } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() { user }: { user: User }): Promise<User> {
    const userData = await this.usersService.findById(user.id);

    if (!userData) {
      throw new NotFoundException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = userData;
    return result;
  }

  @Patch('me')
  async updateUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(user.id, dto);
  }

  @Get('me/wishes')
  async getAuthUserWishes(@Req() { user }: { user: User }): Promise<Wish[]> {
    return await this.usersService.getWishes(Number(user.id));
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.usersService.getWishes(Number(user.id));
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findUser(query);
  }
}
