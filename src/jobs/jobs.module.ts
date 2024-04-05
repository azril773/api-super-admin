import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { JobAccessesModule } from './job_accesses/job_accesses.module';
import { JobActivitiesModule } from './job_activities/job_activities.module';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  exports:[JobsService],
})
export class JobsModule {}
