import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isArray } from "class-validator";

class Result {
    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    @IsEnum(["a","b","c","d","e"],{message:"correct_answer must be one of the following values: a,b,c,d,e"})
    correct_answer:string

    @IsObject()
    @IsNotEmpty()
    answers:Option[]
    
}

class Option {
    @IsString()
    @IsNotEmpty()
    a:string

    @IsString()
    @IsNotEmpty()
    b:string

    @IsString()
    @IsNotEmpty()
    c:string

    @IsString()
    @IsNotEmpty()
    d:string

    @IsString()
    @IsNotEmpty()
    e:string

}


export class CreatePgDto {
    @IsString()
    @IsNotEmpty()
    title:string

    @IsNumber()
    @IsNotEmpty()
    amount:number
    
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
    @IsArray()
    result:Result

}

