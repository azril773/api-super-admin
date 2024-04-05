import { PartialType } from '@nestjs/mapped-types';
import { CreateJobAccessDto } from './create-job_access.dto';

export class UpdateJobAccessDto extends PartialType(CreateJobAccessDto) {}
