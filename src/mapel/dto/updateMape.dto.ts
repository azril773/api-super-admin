import { PartialType } from "@nestjs/mapped-types";
import { CreateMapelDto } from "./createMapel.dto";

export class UpdateMapelDto extends PartialType(CreateMapelDto){}