import { Module } from '@nestjs/common';
import { PgService } from './pg.service';
import { PgController } from './pg.controller';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/database.module';

@Module({
  controllers: [PgController],
  providers: [PgService],
  imports:[DatabaseModule]
})
export class PgModule {}
