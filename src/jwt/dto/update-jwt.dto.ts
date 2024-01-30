import { PartialType } from '@nestjs/mapped-types';
import { CreateJwtDto } from './create-jwt.dto';

export class UpdateJwtDto extends PartialType(CreateJwtDto) {}
