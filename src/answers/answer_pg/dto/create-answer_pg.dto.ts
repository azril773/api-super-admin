import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateAnswerPgDto {
    @IsNotEmpty()
    @IsString()
    answer:string

    @IsNotEmpty()
    @IsString()
    name_user:string

    @IsNotEmpty()
    @IsString()
    code_task:string
}
