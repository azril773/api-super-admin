import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UnauthorizedException, Req, BadGatewayException, UseGuards, UseInterceptors, Inject } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { DataSource } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { Answer } from './entities/answer.entity';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { newDateLocal } from 'functions/dateNow';
import { Db, ObjectId } from 'mongodb';

@Controller('answers')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
export class AnswersController {
  constructor(private readonly answersService: AnswersService,private readonly ds:DataSource,@Inject("Database") private readonly db:Db) {}

  private async check(userId:number, taskId:number){
    const data = await this.ds.query("SELECT * FROM answers WHERE deleted_at IS NULL AND userIdId=? AND taskIdId=?",[userId,taskId])
    if(data.length > 0) throw new BadRequestException("User has been answered the task")
    return true
  }  

  private async getPg(){

  }
  
  private decrypt(req:Request){
    const access_token = req.headers["x-authorization"] ?? null
    if(!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }

  // @Post()
  // @AuthorDec([105])
  // @ResCode(201,"Success create a answer",[])
  // async create(@Body() createAnswerDto: CreateAnswerDto,@Req() req:Request) {
  //   const jwts = this.decrypt(req)
  //   const task = await this.ds.getRepository(Task).findBy({id:createAnswerDto.task_id})
  //   if(task.length <= 0) throw new BadRequestException("Task not found")

  //   const user = await this.ds.query("SELECT * FROM users JOIN roles ON users.roleIdId=roles.id WHERE users.id=? AND roles.name=? AND users.deleted_at IS NULL",[createAnswerDto.user_id,"siswa"])
  //   if(user.length <= 0) throw new BadRequestException("Only student can answer the task")
  //   await this.check(+createAnswerDto.user_id,+createAnswerDto.task_id)

  //   createAnswerDto["created_by"] = jwts.name
  //   createAnswerDto["taskIdId"] = createAnswerDto.task_id
  //   createAnswerDto["userIdId"] = createAnswerDto.user_id
  //   createAnswerDto["updated_by"] = jwts.name
  //   return await this.answersService.create(createAnswerDto)

  // }

  @Post("/findAll")
  @AuthorDec([105])
  @ResCode(201,"Success get all answer",[])
  async findAll(@Body("task_id") task_id:string | number, @Body("type") type:string) {
    let data = {}
    data["answers"] = await this.ds.getRepository(Answer).find({where:{taskIdId:+task_id}})
    switch (type) {
      case "essay":
        data["task"] = await this.ds.getRepository(Task).find({where:{id:+task_id}})
        break;
      case "pg":
        data["task"] = await this.db.collection("pg").find({_id:new ObjectId(task_id)}).toArray()
        break
      default:
        break;
    }

    if(data["task"].length <= 0) throw new BadRequestException("Task not found")
    return data
    // return await this.answersService.findAll();
  }



  @Post('/find')
  @AuthorDec([105])
  @ResCode(201,"Success get a answer",[])
  async findOne(@Body("id") id:string | number) {
    return await this.answersService.findOne("id",+id);
  }
  
  // @Patch(':id')
  // @AuthorDec([105])
  // @ResCode(201,"Success update a answer",[])
  // async update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto,@Req() req:Request) {
  //   const answer = await this.ds.getRepository(Answer).findBy({id:+id})
  //   if(answer.length <= 0) throw new BadRequestException("Answer not found")
  //   const jwts = await this.decrypt(req)
  //   updateAnswerDto["updated_by"] = jwts.name
  //   updateAnswerDto["updated_at"] = newDateLocal()
  //   return await this.answersService.update(+id,updateAnswerDto)
  // }
  
  // @Delete(':id')
  // @AuthorDec([105])
  // @ResCode(201,"Success delete a answer",[])
  // async remove(@Param('id') id: string,@Req() req:Request) {
  //   const jwts = await this.decrypt(req)
  //   return this.answersService.remove(+id,jwts.name);
  // }
}
