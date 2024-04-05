import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { MongoClient } from 'mongodb';

@Module({
  controllers: [],
  providers: [
    {
        provide:"Database",
        useFactory:async () => {
          const db = await MongoClient.connect("mongodb://127.0.0.1")
          return db.db("sims")
        }
      }
  ],
  exports:["Database"]
})
export class DatabaseModule {}
