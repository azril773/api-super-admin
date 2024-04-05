import { Module } from '@nestjs/common';
import { PeriodeService } from './periode.service';
import { PeriodeController } from './periode.controller';

@Module({
  controllers: [PeriodeController],
  providers: [PeriodeService],
})
export class PeriodeModule {}
