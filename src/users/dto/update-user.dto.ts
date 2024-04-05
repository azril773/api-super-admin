import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string
    
    @IsString()
    @IsNotEmpty()
    username:string
    
    @IsString()
    @IsOptional()
    password:string
    
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
