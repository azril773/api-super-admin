import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, BadRequestException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { Role } from 'src/roles/entities/role.entity';
import { generateJwt } from 'functions/generate-jwt';

@Controller('users')
@UseGuards(JwtAuth)
export class UsersController {
  constructor(private readonly usersService: UsersService,private readonly ds:DataSource) {}

  @Post("")
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async create(@Body() createUserDto: CreateUserDto,@Req() req:Request) {
    const cekNameUsers = await this.ds.getRepository(User).findBy({
      name:createUserDto.name
    })
    if(cekNameUsers.length > 0) throw new BadRequestException("User already exist")
    const cekRole = await this.ds.getRepository(Role).findBy({
      id:+createUserDto.role_id
    })
    if(cekRole.length <= 0) throw new BadRequestException("Role not found")
    const authorization = req.headers["authorization"] ?? null
    const jwts = decryptJwt(authorization)
    return await this.usersService.create(createUserDto,jwts.name)
  }

  @Get()
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne("id",+id);
  }

  @Patch(':id')
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req:Request) {
    const authorization = req.headers["authorization"] ?? null
    const jwts = decryptJwt(authorization)
    const cekData = await this.ds.getRepository(User).find({
      where:{
        id:+id
      }
    })

    console.log(cekData)
    if(cekData.length <= 0) throw new BadRequestException("User not found")

    const cekName = await this.ds.getRepository(User).find({
      where:{
        name:updateUserDto.name
      }
    })
    if(cekName.length > 0){
      for (const i of cekName) {
        if(i.deleted_at == null && i.id != cekData[0].id){
          throw new BadRequestException("User already exist")
        }
      }
    }
    return await this.usersService.update(+id,updateUserDto,jwts.name)
  }

  @Delete(':id')
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
