import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterClassDto } from './create-master-class.dto';

export class UpdateMasterClassDto extends PartialType(CreateMasterClassDto) {}
