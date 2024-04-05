import { IsNotEmpty, IsString } from "class-validator";

export class CreateMapelDto{
    @IsString()
    @IsNotEmpty()
    name:string
}