import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { Booking } from "events/booking.entity";
import { Event } from "events/event.entity";
import { User } from "users/user.entity";

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
       host: process.env.DB_HOST || 'localhost',
       port:parseInt(process.env.DB_PORT ?? '3306',10)  || 3306,
       username: process.env.DB_USER || 'root',
       password: process.env.DB_PASS || 'root',
       database: process.env.DB_NAME || 'event_db',
       entities: [User, Event, Booking],
       synchronize: true,

}