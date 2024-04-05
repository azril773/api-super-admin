import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentClassDto {
    @IsNotEmpty()
    @IsNumber()
    masterClass_id:number
    
    @IsNotEmpty()
    @IsNumber()
    periode_id:number
    
    @IsNotEmpty()
    @IsNumber()
    class_id:number

    
}
