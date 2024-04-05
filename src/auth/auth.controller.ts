import { BadRequestException, Body, Controller, Next, Post, Req, Res, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { generateJwt } from "functions/generate-jwt";
import { decryptJwt } from "functions/decrypt-jwt";
import { UsersService } from "src/users/users.service";
import { ResponseIntercept } from "intercept/response.intercept";
import { Reflector } from "@nestjs/core";
import { ResCode } from "decarators/response-code.decarator";
import * as bcrypt from "bcrypt"
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";
import { DataSource } from "typeorm";

@Controller("auth")
export class AuthController{
    constructor(private readonly userservice:UsersService,private readonly ds: DataSource){}
    @Post("/login")
    @ResCode(200,"Success create a user",[]) 
    async login(@Body() {username,password}:LoginDto,@Res() res:Response,@Req() req:Request){
        const cekUsername = await this.ds.query("SELECT * FROM users WHERE username=?",[username])
        if(cekUsername.length <= 0) throw new BadRequestException("Wrong username")
        bcrypt.compare(password,cekUsername[0].password).then((result) => {
            if(result) {
                const refresh = generateJwt({name:cekUsername[0].name,role_id:cekUsername[0].roleIdId},+process.env.EXPIRED_REFRESH_JWT)
                const access = generateJwt({name:cekUsername[0].name,role_id:cekUsername[0].roleIdId},+process.env.EXPIRED_ACCESS_JWT)
                res.cookie("authorization",refresh,{
                    path:"/",
                    maxAge:1000 * 60 * 60 * 24
                }).cookie("x-authorization",access,{
                    path:"/",
                    maxAge:1000 * 60 * 60 * 24
                })
                res.status(200).send({message:"Login success",data:[refresh,access]})
                return true
            }else{
                res.status(400).send({message:"Wrong password",data:null})

                return true

            }
        }).catch(err => {throw new BadRequestException("Wrong password")})
    }
}