import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Booking } from './booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {}

  async findAll() {
    return this.eventsRepo.find();
  }

  async findOne(id: number) {
    const event = await this.eventsRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(input: { title:string; location:string; startDateTime: Date; rows:number; cols:number; imageUrl?: string }) {
    const seatMap = this.buildSeatMap(input.rows, input.cols);
  console.log('EventsService.create input:', input);
  const e = this.eventsRepo.create({ title: input.title, location: input.location, startDateTime: input.startDateTime, seatMap, imageUrl: input.imageUrl });
  const saved = await this.eventsRepo.save(e);
  console.log('EventsService.create saved:', saved);
  return saved;
  }

  async update(id:number, patch: Partial<{ title:string; location:string; startDateTime: Date; rows:number; cols:number; imageUrl?: string }>) {
    const event = await this.findOne(id);
    if (patch.title) event.title = patch.title;
    if (patch.location) event.location = patch.location;
    if (patch.startDateTime) event.startDateTime = patch.startDateTime;
    if (patch.rows && patch.cols) {
      event.seatMap = this.buildSeatMap(patch.rows, patch.cols);
    }
  if ((patch as any).imageUrl !== undefined) event.imageUrl = (patch as any).imageUrl;
    return this.eventsRepo.save(event);
  }

  async remove(id:number) {
    const event = await this.findOne(id);
    await this.eventsRepo.remove(event);
    return { deleted: true };
  }

  async book(eventId: number, userId: number, seatRow: number, seatCol: number) {
    const event = await this.findOne(eventId);

    const r0 = seatRow - 1;
    const c0 = seatCol - 1;

    if (
      r0 < 0 || c0 < 0 ||
      !event.seatMap ||
      r0 >= event.seatMap.length ||
      c0 >= event.seatMap[r0].length
    ) {
      throw new BadRequestException('Invalid seat position');
    }
    if (event.seatMap[r0][c0] === 'X') throw new BadRequestException('Seat already booked');

    console.log(`Booking seat at row ${seatRow}, column ${seatCol} for user ${userId} on event ${eventId}`);

    event.seatMap[r0][c0] = 'X';
    await this.eventsRepo.save(event);

    const booking = this.bookingRepo.create({ event: { id: eventId } as any, user: { id: userId } as any, seatRow: r0, seatCol: c0 });
    return this.bookingRepo.save(booking);
  }

  async seedIfEmpty() {
    const count = await this.eventsRepo.count();
    if (count === 0) {
      const sample: Partial<Event>[] = [
  { title: 'Tech Conference', location: 'Hall A', startDateTime: new Date(Date.now() + 86400000), seatMap: this.buildSeatMap(5, 8), imageUrl: '/assets/Tech1.JPG' },
  { title: 'Music Concert', location: 'Auditorium', startDateTime: new Date(Date.now() + 172800000), seatMap: this.buildSeatMap(6, 10), imageUrl: '/assets/stage.jpg' },
      ];
      await this.eventsRepo.save(sample);
    }
  }

  buildSeatMap(rows: number, cols: number) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'A'));
  }
}
