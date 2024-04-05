import * as ms from "ms"
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, UnauthorizedException, UseGuards, Res, UseInterceptors, SetMetadata, HttpCode } from '@nestjs/common';
import { generateJwt } from 'functions/generate-jwt';
import { Request, Response } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import { ResponseIntercept } from "intercept/response.intercept";
import { Reflector } from "@nestjs/core";

@Controller('jwt')
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class JwtController {

  
  @Post("/get_access_token")
  @SetMetadata("msg","Success generate token")
  access_token(@Req() req:Request){
    const authorization = req.headers["authorization"] ?? null
    if(!authorization) throw new UnauthorizedException("Cannot get access token")
    try {
      const refresh = decryptJwt(authorization)
      if(Object.keys(refresh).includes("response") || Object.keys(refresh).includes("message")) throw new BadRequestException(refresh.response.message)
      const jwt = generateJwt({name:refresh.name,role_id:refresh.role_id},+process.env.EXPIRED_ACCESS_JWT)
      // res.clearCookie("x-authorization")
      // res.cookie("x-authorization",jwt,{
      //   path:"/" 
      // })
      // res.status(200).send({message:"Succes generate token",data:null})
      return jwt
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  } 


  @Post("/decrypt")
  @HttpCode(200)
  @SetMetadata("msg","Success decrypt token")
  decryptToken(@Body("jwt") jwt:string) {
    const decrypt = decryptJwt(jwt)
    // if(Object.keys(decrypt).includes("response") &&)
    if(Object.keys(decrypt).includes("response") || Object.keys(decrypt).includes("message")) throw new UnauthorizedException(decrypt.response.message)
    // console.log(decrypt,"controller")
    return decrypt
  }

  @Post("/encrypt")
  @SetMetadata("msg","Success decrypt token")
  encrypt(@Body("name") name:string) {
    return generateJwt({name},+process.env.EXPIRED_ACCESS_JWT)
  }

}
