import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateStudentDto {
    @IsNotEmpty()
    @IsNumber()
    user_id:number

    @IsNotEmpty()
    @IsNumber()
    studentClass_id:number
}
