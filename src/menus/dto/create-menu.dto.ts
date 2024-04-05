import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    icon:string

    @IsString()
    @IsOptional(    )
    url:string

    @IsString()
    @IsNotEmpty()
    type:string
}
