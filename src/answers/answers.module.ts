import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { DatabaseModule } from 'src/database.module';
import { AnswerPgModule } from './answer_pg/answer_pg.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [DatabaseModule, AnswerPgModule],
})
export class AnswersModule {}
