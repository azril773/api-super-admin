import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreatePgDto {
    @IsString()
    @IsNotEmpty()
    title:string
    
    @IsString()
    @IsNotEmpty()
    @IsEnum(["pg"],{message:"type must be one of the following values: pg"})
    type:string

    @IsNumber()
    @IsNotEmpty()
    student_class:number

    @IsNumber()
    @IsNotEmpty()
    mapel:number

    @IsDateString()
    @IsNotEmpty()
    deadline:Date
    
    @IsNotEmpty()
    @IsString()
    a:string

    @IsNotEmpty()
    @IsString()
    b:string

    @IsNotEmpty()
    @IsString()
    c:string

    @IsNotEmpty()
    @IsOptional()
    d:string

    @IsNotEmpty()
    @IsOptional()
    e:string

}

