import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Booking } from './booking.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Booking])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule implements OnModuleInit {
  constructor(private events: EventsService) {}
  async onModuleInit() {
    await this.events.seedIfEmpty();
  }
}
