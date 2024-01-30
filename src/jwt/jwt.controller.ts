import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CreateJwtDto } from './dto/create-jwt.dto';
import { UpdateJwtDto } from './dto/update-jwt.dto';
import { generateJwt } from 'functions/generate-jwt';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';

@Controller('jwt')
export class JwtController {
  constructor(private readonly jwtService: JwtService) {}

  
  @Post("/jwt")
  po(){
    return generateJwt("")
  }


  @Post("dec")
  findAll(@Req() req:Request) {
    return decryptJwt(req.headers["authorization"])
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jwtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJwtDto: UpdateJwtDto) {
    return this.jwtService.update(+id, updateJwtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jwtService.remove(+id);
  }
}
