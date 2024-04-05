import { Module } from '@nestjs/common';
import { JobActivitiesService } from './job_activities.service';
import { JobActivitiesController } from './job_activities.controller';
import { SubmenuModule } from 'src/menus/submenu/submenu.module';
import { JobsModule } from '../jobs.module';

@Module({
  controllers: [JobActivitiesController],
  providers: [JobActivitiesService],
  imports:[JobsModule,SubmenuModule]
})
export class JobActivitiesModule {}
