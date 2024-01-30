import { IsEnum, IsISSN, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string
    
    @IsString()
    @IsNotEmpty()
    picture:string

    @IsString()
    @IsNotEmpty()
    @IsEnum(["active","deactive"],{message:"status must be one of the following values: active or deactive"})
    status:string

    @IsNotEmpty()
    @IsNumber()
    role_id:number
}
