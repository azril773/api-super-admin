import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from './create-answer.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAnswerDto {
    @IsNotEmpty()
    @IsString()
    answer:string

}
