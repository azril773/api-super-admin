import { Module } from '@nestjs/common';
import { StudentClassService } from './student-class.service';
import { StudentClassController } from './student-class.controller';

@Module({
  controllers: [StudentClassController],
  providers: [StudentClassService],
  exports:[StudentClassService]
})
export class StudentClassModule {}
