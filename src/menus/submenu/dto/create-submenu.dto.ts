import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubmenuDto {
    @IsNotEmpty()
    @IsNumber()
    menu_id:number

    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    url:string
}
