import { Module } from '@nestjs/common';
import { SubmenuService } from './submenu.service';
import { SubmenuController } from './submenu.controller';
import { MenusModule } from '../menus.module';

@Module({
  controllers: [SubmenuController],
  providers: [SubmenuService],
  imports:[MenusModule],
  exports:[SubmenuService]
})
export class SubmenuModule {}
