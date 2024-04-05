import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, BadRequestException, UnauthorizedException, Req, Inject } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { AuthorJob } from 'guards/author-job.guard';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { DataSource, Equal, Not } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RandomKode } from 'functions/generate-code';
import { Task } from './entities/task.entity';
import { newDateLocal } from 'functions/dateNow';
import { UpdateAnswerDto } from 'src/answers/dto/update-answer.dto';
import { Db } from 'mongodb';
import { StudentClassService } from 'src/student/student-class/student-class.service';
import { MapelService } from 'src/mapel/mapel.service';

@Controller('tasks')
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly ds: DataSource,private readonly studentClassService:StudentClassService,private readonly mapelService:MapelService) { }

  async isUniqueCombination(title:string,studentClassId: number, mapelId: number, taskId?: number): Promise<boolean> {
    const existingTask = await this.ds.getRepository(Task).findOne({
      where: {
        title,
        studentClass_id:studentClassId,
        mapel_id:mapelId,
        ...(taskId ? { id: Not(Equal(taskId)) } : {}),
      },
    });

    return !existingTask
  }

  private decrypt(req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }

  private async checkTitle(value: string,name:string) {
    const data = await this.tasksService.findOne('title', value,name)
    if (data.length > 0) throw new BadRequestException("Title already exist")
    return data
  }

  private async checkTask(value: string,name:string) {
    const data = await this.tasksService.findOne('task', value,name)
    if (data.length > 0) throw new BadRequestException("Task already exist")
    return data
  }

  @Post("/essay")
  @AuthorDec([105])
  @ResCode(201, "Success create a essay", [])
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const jwts = await this.decrypt(req)
    const exist = await this.isUniqueCombination(createTaskDto.title,createTaskDto.student_class,createTaskDto.mapel)
    const mapel = await this.mapelService.findOne(+createTaskDto.mapel)
    if(!mapel) throw new BadRequestException("mapel not found")
    const studentClass = await this.studentClassService.findOne(+createTaskDto.student_class,"id")
    if(studentClass.length <= 0) throw new BadRequestException("student class not found")
    // console.log(exist)
    const title = await this.checkTitle(createTaskDto.title,jwts.name)
    const task = await this.checkTask(createTaskDto.task,jwts.name)
    const user = await this.ds.getRepository(User).find({
      where: {
        name: jwts.name
      }
    })
    if (user.length <= 0) throw new BadRequestException("User not found")
    const kode = RandomKode(6)
    createTaskDto["type"] = 'essay'
    createTaskDto["kode"] = kode
    createTaskDto["mapelIdId"] = createTaskDto.mapel
    createTaskDto["studentClassIdId"] = createTaskDto.student_class
    createTaskDto["created_by"] = jwts.name
    createTaskDto["updated_by"] = jwts.name
    // return await this.tasksService.create(createTaskDto)

  }


  @Get()
  @AuthorDec([105])
  @ResCode(201, "Success get all task", [])
  async findAll(@Req() req:Request) {
    const jwts = this.decrypt(req)
    return await this.tasksService.findAll(jwts.name);
  }

  @Get("/student/task")
  @AuthorDec([105])
  @ResCode(201, "Success get all task", [])
  async findAllStudent(@Req() req:Request) {
    const jwts = this.decrypt(req)
    return await this.tasksService.findAll(jwts.name);
  }

  @Get('/student/task/:id')
  @AuthorDec([105])
  @ResCode(201, "Success get a task", [])
  async findOneStudent(@Param('id') id: string,@Req() req:Request) {
    const jwts = this.decrypt(req)
    return await this.tasksService.findOne("id", +id,jwts.name);
  }

  @Get(':id')
  @AuthorDec([105])
  @ResCode(201, "Success get a task", [])
  async findOne(@Param('id') id: string,@Req() req:Request) {
    const jwts = this.decrypt(req)
    return await this.tasksService.findOne("id", +id,jwts.name);
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(201, "Success update a task", [])
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
    const jwts = this.decrypt(req)
    const dataTask = await this.tasksService.findOne("id", +id,jwts.name)
    if (dataTask.length <= 0) throw new BadRequestException("Task not found")
    const repo = this.ds.getRepository(Task)

    const title = await repo.query("SELECT * FROM tasks WHERE NOT id=? AND title=? AND deleted_at IS NULL", [id, updateTaskDto.title])
    if (title.length > 0) throw new BadRequestException("Title already exist")
    const task = await repo.query("SELECT * FROM tasks WHERE NOT id=? AND task=? AND deleted_at IS NULL", [id, updateTaskDto.task])
    if (task.length > 0) throw new BadRequestException("Task already exist")

    updateTaskDto["updated_by"] = jwts.name
    UpdateAnswerDto["updated_at"] = newDateLocal()
    // return await this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(201, "Success delete a task", [])
  async remove(@Param('id') id: string, @Req() req: Request) {
    const jwts = this.decrypt(req)
    return await this.tasksService.remove(+id, jwts.name);
  }
}
