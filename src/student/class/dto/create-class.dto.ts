import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    class:string
}
