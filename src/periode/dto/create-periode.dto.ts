import { IsNotEmpty, IsString } from "class-validator";

export class CreatePeriodeDto {
    @IsNotEmpty()
    @IsString()
    periode:string
}
