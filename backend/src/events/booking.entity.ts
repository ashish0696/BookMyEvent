import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from './event.entity';

@Entity()
@Unique(['event', 'seatRow', 'seatCol'])
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.bookings, { eager: true })
  user!: User;

  @ManyToOne(() => Event, (e) => e.bookings, { eager: true, onDelete: 'CASCADE' })
  event!: Event;

  @Column()
  seatRow!: number;

  @Column()
  seatCol!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
