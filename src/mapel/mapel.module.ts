import { Module } from "@nestjs/common";
import { MapelController } from "./mapel.controller";
import { MapelService } from "./mapel.service";

@Module({
    controllers:[MapelController],
    providers:[MapelService],
    exports:[MapelService]
})
export class MapelModule{}