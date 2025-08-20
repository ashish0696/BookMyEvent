import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  location!: string;

  @Column({ type: 'datetime' })
  startDateTime!: Date;

  @Column({ type: 'simple-json' })
  seatMap!: string[][]; 

  @OneToMany(() => Booking, (b) => b.event)
  bookings!: Booking[];
}
