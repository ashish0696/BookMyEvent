import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../events/booking.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  contact!: string;

  @Column()
  address!: string;

  @Column()
  @Exclude()
  password!: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];
}
