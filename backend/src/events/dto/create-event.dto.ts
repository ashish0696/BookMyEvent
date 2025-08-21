import { IsString, IsInt, Min, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2025' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'San Francisco' })
  @IsString()
  location!: string;

  @ApiProperty({ example: '2025-08-20T10:00:00.000Z', description: 'ISO date-time string' })
  @IsDateString()
  startDateTime!: string; // ISO string

  @ApiProperty({ minimum: 1, example: 10 })
  @IsInt()
  @Min(1)
  rows!: number;

  @ApiProperty({ minimum: 1, example: 12 })
  @IsInt()
  @Min(1)
  cols!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
