import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookEventDto {
  @ApiProperty({ minimum: 1, example: 1, description: '1-based seat row as seen by users' })
  @IsInt()
  @Min(1)
  seatRow!: number;

  @ApiProperty({ minimum: 1, example: 1, description: '1-based seat column as seen by users' })
  @IsInt()
  @Min(1)
  seatCol!: number;
}
