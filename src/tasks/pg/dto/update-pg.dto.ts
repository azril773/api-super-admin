import { PartialType } from '@nestjs/mapped-types';
import { CreatePgDto } from './create-pg.dto';

export class UpdatePgDto extends PartialType(CreatePgDto) {}
