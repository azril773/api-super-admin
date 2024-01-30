import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateJobDto {
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    description:string

    @IsOptional()
    @IsString()
    icon:string

    @IsString()
    @IsNotEmpty()
    url:string
}
