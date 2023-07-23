import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsNumber, IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  @IsNumber()
  amount: number;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
