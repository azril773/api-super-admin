import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsNotEmpty()
    task:string
    

    @IsNumber()
    @IsNotEmpty()
    student_class:number
    
    @IsNumber()
    @IsNotEmpty()
    mapel:number
    
    @IsDateString()
    @IsNotEmpty()
    deadline:Date


    @IsString()
    @IsNotEmpty()
    @IsEnum(["pg","essay"],{message:"status must be one of the following values: pg or essay"})
    type:string


}
