import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, BadRequestException, Req, UnauthorizedException } from '@nestjs/common';
import { JobAccessesService } from './job_accesses.service';
import { CreateJobAccessDto } from './dto/create-job_access.dto';
import { UpdateJobAccessDto } from './dto/update-job_access.dto';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ResponseIntercept } from 'intercept/response.intercept';
import { ResCode } from 'decarators/response-code.decarator';
import { UsersService } from 'src/users/users.service';
import { JobsService } from '../jobs.service';
import { DataSource } from 'typeorm';
import { JobAccess } from '../entities/job_access.entity';
import { Request } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import { newDateLocal } from 'functions/dateNow';

@Controller('job_accesses')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
export class JobAccessesController {
  constructor(private readonly jobAccessesService: JobAccessesService, private readonly userService: UsersService, private readonly jobService: JobsService, private readonly ds: DataSource) { }

  @Post()
  @ResCode(201, "success create job accessess", ['super_admin'])
  async create(@Body() createJobAccessDto: CreateJobAccessDto, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const user = await this.userService.findOne("id", +createJobAccessDto.user_id)
    const job = await this.jobService.findOne("id", +createJobAccessDto.job_id)
    console.log(job, user)
    if (job.length <= 0 || user.length <= 0) throw new BadRequestException("Error user or job not found")
    const jobAccesses = await this.ds.getRepository(JobAccess).createQueryBuilder("access").where("access.user_id=:user_id", { user_id: +createJobAccessDto.user_id }).andWhere("access.job_id=:job_id", { job_id: +createJobAccessDto.job_id }).getMany()
    if (jobAccesses.length > 0) throw new BadRequestException("Job accesses already exist")
    createJobAccessDto["userIdId"] = createJobAccessDto["user_id"]
    createJobAccessDto["jobIdId"] = createJobAccessDto["job_id"]
    return await this.jobAccessesService.create(createJobAccessDto, jwts.name)
  }

  @Get()
  @ResCode(200, "success get all job accessess", ['super_admin'])
  async findAll() {
    return await this.ds.query("SELECT job_accesses.id as id_jobac,users.name as name_user, users.id as id_user, jobs.name as name_job, jobs.id as id_job FROM job_accesses JOIN users ON users.id=job_accesses.userIdId JOIN jobs ON jobs.id=job_accesses.jobIdId WHERE job_accesses.deleted_at IS NULL")
  }

  @Get(':id')
  @ResCode(200, "success get a job accessess", ['super_admin'])
  async findOne(@Param('id') id: string) {
    const data = await this.ds.query("SELECT job_accesses.id as id_jobac,users.name as name_user, users.id as id_user, jobs.name as name_job, jobs.id as id_job FROM job_accesses JOIN users ON users.id=job_accesses.userIdId JOIN jobs ON jobs.id=job_accesses.jobIdId WHERE job_accesses.deleted_at IS NULL AND job_accesses.id=?",[+id])
    return data
  }

  @Get('/user_id/:id')
  @ResCode(200, "success get a job accessess", ['super_admin'])
  async findOneWithUser(@Param('id') id: string) {
    const data = await this.ds.query("")
    return data
  }

  @Patch(':id')
  @ResCode(200, "success update a job accessess", ['super_admin'])
  async update(@Param('id') id: string, @Body() updateJobAccessDto: UpdateJobAccessDto, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const job_access = await this.jobAccessesService.findOne(+id)
    console.log(job_access)
    if (job_access.length <= 0) throw new BadRequestException("Job access not found")
    const user = await this.userService.findOne("id", +updateJobAccessDto.user_id)
    const job = await this.jobService.findOne("id", +updateJobAccessDto.job_id)
    if (job.length <= 0 || user.length <= 0) throw new BadRequestException("Error user or job not found")
    updateJobAccessDto["userIdId"] = updateJobAccessDto["user_id"]
    updateJobAccessDto["jobIdId"] = updateJobAccessDto["job_id"]
    updateJobAccessDto["updated_at"] = newDateLocal()
    updateJobAccessDto["updated_by"] = jwts.name
    return this.jobAccessesService.update(+id, updateJobAccessDto);
  }

  @Delete(':id')
  @ResCode(200, "success delete a job accessess", ['super_admin'])
  async remove(@Param('id') id: string, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const job_access = await this.jobAccessesService.findOne(+id)
    if (job_access.length <= 0) throw new BadRequestException("Job access not found")
    return this.jobAccessesService.remove(+id, jwts.name);
  }
}
