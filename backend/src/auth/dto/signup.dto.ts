import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: '+1 555-1234' })
  @IsString()
  contact!: string;

  @ApiProperty({ example: '123 Main St, Springfield' })
  @IsString()
  address!: string;
}
