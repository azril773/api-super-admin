import { Module } from '@nestjs/common';
import { AbsentService } from './absent.service';
import { AbsentController } from './absent.controller';

@Module({
  controllers: [AbsentController],
  providers: [AbsentService],
})
export class AbsentModule {}
