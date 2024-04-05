import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PgModule } from './pg/pg.module';
import { MapelModule } from 'src/mapel/mapel.module';
import { StudentClassModule } from 'src/student/student-class/student-class.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PgModule,MapelModule,StudentClassModule],
})
export class TasksModule {}
