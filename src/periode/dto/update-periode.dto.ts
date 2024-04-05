import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodeDto } from './create-periode.dto';

export class UpdatePeriodeDto extends PartialType(CreatePeriodeDto) {}
