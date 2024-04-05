import { Controller, Get, SetMetadata, UseGuards, UseInterceptors } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import AuthorDec from "decarators/author.decarator";
import { ResCode } from "decarators/response-code.decarator";
import { AuthorJob } from "guards/author-job.guard";
import { JwtAuth } from "guards/jwt-auth.guard";
import { ResponseIntercept } from "intercept/response.intercept";

@Controller("test")
@UseGuards(JwtAuth)
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(AuthorJob)
export class TestController{
    @Get("/")   
    @AuthorDec([105,106])
    @ResCode(200,"sucess",["super_admin"])
    sldkd(){
        return 'ok'
    }
}