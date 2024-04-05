import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, BadRequestException, UseGuards, UseInterceptors } from '@nestjs/common';
import { JobActivitiesService } from './job_activities.service';
import { CreateJobActivityDto } from './dto/create-job_activity.dto';
import { UpdateJobActivityDto } from './dto/update-job_activity.dto';
import { Request } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import { UsersService } from 'src/users/users.service';
import { JobsService } from '../jobs.service';
import { DataSource } from 'typeorm';
import { JobActivity } from '../entities/job_activity.entity';
import { SubmenuService } from 'src/menus/submenu/submenu.service';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { ResCode } from 'decarators/response-code.decarator';

@Controller('job_activities')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
export class JobActivitiesController {
  constructor(private readonly jobActivitiesService: JobActivitiesService, private readonly jobService: JobsService, private readonly submenuService: SubmenuService, private readonly ds: DataSource) { }

  @Post()
  @ResCode(201,"Success add a job activity",["super_admin"])
  async create(@Body() createJobActivityDto: CreateJobActivityDto, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const user = await this.jobService.findOne("id", +createJobActivityDto.job_id)
    const job = await this.submenuService.findOne("id", +createJobActivityDto.submenu_id)
    if (job.length <= 0 || user.length <= 0) throw new BadRequestException("Error user or job not found")
    const jobActivities = await this.ds.getRepository(JobActivity).createQueryBuilder('job').where("job.job_id=:job_id", { job_id: +createJobActivityDto.job_id }).andWhere("job.submenu_id=:submenu_id", { submenu_id: +createJobActivityDto.submenu_id }).getMany()
    if (jobActivities.length > 0) throw new BadRequestException("Job activity already exist")
    createJobActivityDto["jobIdId"] = createJobActivityDto['job_id']
    createJobActivityDto["submenuIdId"] = createJobActivityDto['submenu_id']
    return await this.jobActivitiesService.create(createJobActivityDto, jwts.name)
  }

  @Get()
  @ResCode(200,"Success get all job activity",["super_admin"])
  async findAll() {
    return await this.jobActivitiesService.findAll();
  }

  @Get(':id')
  @ResCode(200,"Success get a job activity",["super_admin"])
  async findOne(@Param('id') id: string) {
    return await this.jobActivitiesService.findOne(+id);
  }

  @Get('/job_id/:id')
  @ResCode(200,"Success get a job activity",["super_admin"])
  async findOneWithJob(@Param('id') id: string) {
    return await this.ds.getRepository(JobActivity).findBy({job_id:+id})
  }

  @Patch(':id')
  @ResCode(200,"Success update a job activity",["super_admin"])
  async update(@Param('id') id: string, @Body() updateJobActivityDto: UpdateJobActivityDto, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const job_access = await this.jobActivitiesService.findOne(+id)
    console.log(job_access)
    if (job_access.length <= 0) throw new BadRequestException("Job activity not found")
    const submenu = await this.submenuService.findOne("id", +updateJobActivityDto.submenu_id)
    const job = await this.jobService.findOne("id", +updateJobActivityDto.job_id)
    if (job.length <= 0 || submenu.length <= 0) throw new BadRequestException("Error user or job not found")
    return this.jobActivitiesService.update(+id, updateJobActivityDto, jwts.name);
  }

  @Delete(':id')
  @ResCode(200,"Success delete a job activity",["super_admin"])
  async remove(@Param('id') id: string, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const job_access = await this.jobActivitiesService.findOne(+id)
    if (job_access.length <= 0) throw new BadRequestException("Job activity not found")
    return this.jobActivitiesService.remove(+id, jwts.name);

  }
}
