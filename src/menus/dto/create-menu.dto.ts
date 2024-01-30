import { IsNotEmpty, IsString } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    icon:string

    @IsString()
    @IsNotEmpty()
    url:string

    @IsString()
    @IsNotEmpty()
    type:string
}
