import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { SubmenuModule } from './submenu/submenu.module';

@Module({
  controllers: [MenusController],
  providers: [MenusService],
  exports:[MenusService]
})
export class MenusModule {}
