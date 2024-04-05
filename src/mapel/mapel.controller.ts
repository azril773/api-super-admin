import { BadRequestException, Body, Controller, Delete, Get, Headers, Param, Patch, Post, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateMapelDto } from "./dto/createMapel.dto";
import { decryptJwt } from "functions/decrypt-jwt";
import { ResponseIntercept } from "intercept/response.intercept";
import { Reflector } from "@nestjs/core";
import { JwtAuth } from "guards/jwt-auth.guard";
import AuthorDec from "decarators/author.decarator";
import { AuthorJob } from "guards/author-job.guard";
import { ResCode } from "decarators/response-code.decarator";
import { UpdateMapelDto } from "./dto/updateMape.dto";
import { Task } from "src/tasks/entities/task.entity";
import { Mapel } from "./entity/mapel.entity";
import { MapelService } from "./mapel.service";

@Controller("mapel")
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
export class MapelController {
    constructor(private readonly ds: DataSource, private readonly mapelService: MapelService) { }

    private decrypt(jwt: string) {
        const access_token = jwt ?? null
        if (!access_token) throw new UnauthorizedException("Access denied")
        const jwts = decryptJwt(access_token)
        return jwts
    }

    @Post()
    @AuthorDec([109])
    @ResCode(201, "success create a mapel", [])
    async createMapel(@Body() createMapelDto: CreateMapelDto, @Headers("x-authorization") xAuthorization: string) {
        const jwts = await this.decrypt(xAuthorization)
        createMapelDto["created_by"] = jwts.name
        createMapelDto["updated_by"] = jwts.name
        return await this.mapelService.create(createMapelDto)
    }

    @Get()
    @AuthorDec([109])
    @ResCode(200, "success get all mapel", [])
    async findAllMapel(ceateMapelDto: CreateMapelDto, @Headers("x-authorization") xAuthorization: string) {

    }
    @Get(":id")
    @AuthorDec([109])
    @ResCode(200, "success get a mapel", [])
    async findMapel(@Param("id") id: string) {
        const mapel = await this.mapelService.findOne(Number(id));
        if (!mapel) {
            throw new BadRequestException("data not found")
        }
        return mapel;
    }
    @Patch(":id")
    @AuthorDec([109])
    @ResCode(200, "success update a mapel", [])
    async updateMapel(@Param("id") id: string, @Body() updateMapelDto: UpdateMapelDto, @Headers("x-authorization") xAuthorization: string) {
        const jwts = await this.decrypt(xAuthorization)
        return await this.mapelService.update(+id, updateMapelDto, jwts.name)
    }
    @Delete(':id')
    @AuthorDec([109])
    @ResCode(200, "success delete a mapel", [])
    async delete(@Param('id') id: string) {
        try {
            await this.mapelService.delete(Number(id));
            return "Mapel deleted successfully"
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}