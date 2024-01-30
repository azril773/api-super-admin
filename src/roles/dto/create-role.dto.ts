import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    description:string

    @IsString()
    @IsNotEmpty()
    dashboard_url:string
}

