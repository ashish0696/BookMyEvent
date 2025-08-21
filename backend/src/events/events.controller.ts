import { Controller, Get, Param, ParseIntPipe, Post, Body, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { BookEventDto } from './dto/book-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@ApiBearerAuth('bearer')
@Controller('events')
export class EventsController {
  constructor(private events: EventsService) {}

  @Get()
  list() {
    return this.events.findAll();
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.events.findOne(id);
  }

  @Post(':id/book')
  @UseGuards(AuthGuard('jwt'))
  book(@Param('id', ParseIntPipe) id: number, @Body() dto: BookEventDto, @Req() req: any) {
    return this.events.book(id, req.user.userId, dto.seatRow, dto.seatCol);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateEventDto) {
  console.log('EventsController.create received dto:', dto);
    return this.events.create({
      title: dto.title,
      location: dto.location,
      startDateTime: new Date(dto.startDateTime),
      rows: dto.rows,
  cols: dto.cols,
  imageUrl: (dto as any).imageUrl,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    const patch: any = { ...dto };
    if (dto.startDateTime) patch.startDateTime = new Date(dto.startDateTime);
    return this.events.update(id, patch);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.events.remove(id);
  }
}
