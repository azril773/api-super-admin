import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateJobActivityDto {
    @IsNotEmpty()
    @IsNumber()
    job_id:number

    @IsNotEmpty()
    @IsNumber()
    submenu_id:number
}
