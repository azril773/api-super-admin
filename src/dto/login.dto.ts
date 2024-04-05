import { IsNotEmpty, IsString, isNotEmpty } from "class-validator"

export class LoginDto{
    @IsNotEmpty()
    @IsString()
    username:string
    
    @IsString()
    @IsNotEmpty()
    password:string
}