import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
  providers: [],
  exports:[]
})
export class TestModule {}
