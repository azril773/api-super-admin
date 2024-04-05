import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAnswerDto {
    @IsNotEmpty()
    @IsString()
    answer:string

    @IsNotEmpty()
    @IsNumber()
    user_id:number

    @IsNotEmpty()
    @IsNumber()
    task_id:number

    @IsNotEmpty()
    @IsString()
    type:string
}
