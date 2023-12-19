import { NestFactory } from '@nestjs/core';
import mongoose, { Mongoose } from 'mongoose';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ 
    origin: [process.env.CLIENT_URL, 'http://localhost:3001'],
    credentials: true
  })
  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(cookieParser())

  await app.listen(process.env.PORT)
}
bootstrap()
