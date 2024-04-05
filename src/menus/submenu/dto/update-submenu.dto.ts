import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmenuDto } from './create-submenu.dto';

export class UpdateSubmenuDto extends PartialType(CreateSubmenuDto) {}
