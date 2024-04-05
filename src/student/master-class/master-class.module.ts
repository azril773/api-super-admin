import { Module } from '@nestjs/common';
import { MasterClassService } from './master-class.service';
import { MasterClassController } from './master-class.controller';

@Module({
  controllers: [MasterClassController],
  providers: [MasterClassService],
})
export class MasterClassModule {}
