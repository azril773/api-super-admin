require("dotenv").config()
import * as bodyParser from "body-parser"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as multer from "multer"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:true,credentials:true})
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix("api") 
  // app.use(multer({dest:"/public"}))
  await app.listen(3300);
}
bootstrap();
