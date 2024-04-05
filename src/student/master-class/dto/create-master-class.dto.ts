import { IsNotEmpty, IsString } from "class-validator";

export class CreateMasterClassDto {
    @IsString()
    @IsNotEmpty()
    name:string
}
