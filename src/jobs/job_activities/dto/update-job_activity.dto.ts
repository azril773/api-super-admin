import { PartialType } from '@nestjs/mapped-types';
import { CreateJobActivityDto } from './create-job_activity.dto';

export class UpdateJobActivityDto extends PartialType(CreateJobActivityDto) {}
