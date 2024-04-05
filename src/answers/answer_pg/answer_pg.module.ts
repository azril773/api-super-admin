import { Module } from '@nestjs/common';
import { AnswerPgService } from './answer_pg.service';
import { AnswerPgController } from './answer_pg.controller';
import { DatabaseModule } from 'src/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AnswerPgController],
  providers: [AnswerPgService],
  imports:[DatabaseModule,UsersModule]
})
export class AnswerPgModule {}
