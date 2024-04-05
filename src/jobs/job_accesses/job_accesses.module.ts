import { Module } from '@nestjs/common';
import { JobAccessesService } from './job_accesses.service';
import { JobAccessesController } from './job_accesses.controller';
import { UsersModule } from 'src/users/users.module';
import { JobsModule } from '../jobs.module';

@Module({
  controllers: [JobAccessesController],
  providers: [JobAccessesService],
  imports:[UsersModule,JobsModule]
})
export class JobAccessesModule {}
