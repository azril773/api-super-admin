import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, BadRequestException, UnauthorizedException, Req, UseInterceptors, UseGuards } from '@nestjs/common';
import { AnswerPgService } from './answer_pg.service';
import { CreateAnswerPgDto } from './dto/create-answer_pg.dto';
import { UpdateAnswerPgDto } from './dto/update-answer_pg.dto';
import { Db, ObjectId } from 'mongodb';
import { UsersService } from 'src/users/users.service';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { newDateLocal } from 'functions/dateNow';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Controller('answer-pg')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
export class AnswerPgController {
  constructor(private readonly answerPgService: AnswerPgService, @Inject("Database") private readonly db: Db, private readonly ds: DataSource) { }


  private async getUser(name: string) {
    const user = await this.ds.query("SELECT roles.name as role_name,users.* FROM users JOIN roles ON users.roleIdId=roles.id WHERE users.name=? AND roles.name=? AND users.deleted_at IS NULL", [name, "siswa"])
    console.log(user, 'user')

    if (user.length <= 0) throw new BadRequestException("User not found")
    return user
  }

  private async getTask(code: string) {
    const task = await this.db.collection('pg').find({ kode: code }).toArray()
    if (task.length <= 0) throw new BadRequestException("task not found")
    return task
  }

  private decrypt(req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }

  private async checkData(req: Request, dtoAnswer) {
    try {
      const jwts = await this.decrypt(req)
      const user = await this.getUser(dtoAnswer.name_user)
      console.log(user)
      const task = await this.getTask(dtoAnswer.code_task)
      return { jwts, user, task }
    } catch (error) {
      console.log(error)
      throw new BadRequestException("User or task not found")
    }
  }




  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a pg", [])
  async create(@Body() createAnswerPgDto: CreateAnswerPgDto, @Req() req: Request) {
    try {
      const { jwts, task, user } = await this.checkData(req, createAnswerPgDto)
      const check = await this.db.collection("answer_pg").find({ $and: [{ name_user: user[0].name }, { code_task: task[0].kode }] }).toArray()
      if (check.length > 0) throw new BadRequestException("Already exist")
      createAnswerPgDto["created_by"] = jwts.name
      createAnswerPgDto["updated_by"] = jwts.name
      createAnswerPgDto["created_at"] = newDateLocal()
      createAnswerPgDto["updated_at"] = newDateLocal()
      createAnswerPgDto["deleted_at"] = null
      return await this.db.collection("answer_pg").insertOne(createAnswerPgDto)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Get("/getAll/:code")
  @AuthorDec([105])
  @ResCode(201, "Success get all pg", [])
  async findAll(@Param("code") code: string) {
    return await this.db.collection("answer_pg").find({ code_task: code }).toArray()
  }

  @Get(':code')
  @AuthorDec([105])
  @ResCode(201, "Success get a pg", [])
  async findOne(@Param('code') code: string) {
    return await this.db.collection("answer_pg").find({ code_task: code })
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(201, "Success update a pg", [])
  async update(@Param('id') id: string, @Body() updateAnswerPgDto: UpdateAnswerPgDto, @Req() req: Request) {
    try {
      const data = await this.db.collection("answer_pg").find({_id:new ObjectId(id)}).toArray()
      if(data.length <= 0) throw new BadRequestException("Data not found")
      updateAnswerPgDto["name_user"] = data[0].name_user
      const { jwts, task, user } = await this.checkData(req, updateAnswerPgDto)
      const check = await this.db.collection("answer_pg").find({ $and: [{ name_user: user[0].name }, { code_task: task[0].kode }] }).toArray()
      if(check.length <= 0) throw new BadRequestException("Data not found")
      updateAnswerPgDto["updated_at"] = newDateLocal()
      updateAnswerPgDto["updated_by"] = jwts.name
      return this.db.collection("answer_pg").updateOne({_id:new ObjectId(id)},{$set:updateAnswerPgDto})
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(201, "Success delete a pg", [])
  remove(@Param('id') id: string) {
    return this.answerPgService.remove(+id);
  }
}
