import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerPgDto } from './create-answer_pg.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerPgDto {
    @IsNotEmpty()
    @IsString()
    answer:string

    @IsNotEmpty()
    @IsString()
    code_task:string
}
