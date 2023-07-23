import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { HashModule } from 'src/hash/hash.module';
import { Wish } from 'src/wishes/entities/wish.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Wish]), HashModule],
  exports: [UsersService],
})
export class UsersModule {}
