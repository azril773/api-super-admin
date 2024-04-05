import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateJobAccessDto {
    @IsNotEmpty()
    @IsNumber()
    user_id:number

    @IsNotEmpty()
    @IsNumber()
    job_id:number
}
