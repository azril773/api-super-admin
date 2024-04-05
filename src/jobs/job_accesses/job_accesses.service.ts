import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobAccessDto } from './dto/create-job_access.dto';
import { UpdateJobAccessDto } from './dto/update-job_access.dto';
import { DataSource } from 'typeorm';
import { JobAccess } from '../entities/job_access.entity';
import { newDateLocal } from 'functions/dateNow';

@Injectable()
export class JobAccessesService {
  private joinquery:string = "SELECT job_accesses.*,job_accesses.id as job_accesses_id,users.roleIdId as role_id_user, users.name as name_user,users.picture as picture_user, users.status as status_user,jobs.name as name_job, jobs.description as description_job,jobs.icon as icon_job, jobs.url as url_job FROM job_accesses JOIN users ON users.id=job_accesses.userIdId JOIN jobs ON jobs.id=job_accesses.jobIdId WHERE job_accesses.deleted_at IS NULL"
  

  constructor(private readonly ds:DataSource){}
  async create(createJobAccessDto: CreateJobAccessDto,name:string) {
    createJobAccessDto["created_by"] = name
    createJobAccessDto["updated_by"] = name
    console.log(name)
    return await this.ds.getRepository(JobAccess).save(createJobAccessDto)
  }

  async findAll() {
    return await this.ds.query(`${this.joinquery}`)
  }

  async findOne(id: number) {
    return await this.ds.query(`${this.joinquery} AND job_accesses.id=?`,[id])
  }

  async update(id: number, updateJobAccessDto: UpdateJobAccessDto) {
    return await this.ds.getRepository(JobAccess).update({id:+id},updateJobAccessDto)
  }

  async remove(id: number,name:string) {
    const repo = this.ds.getRepository(JobAccess)
    await repo.update({
      id:+id
    },{
      updated_by:name,updated_at:newDateLocal()
    })
    return await repo.softDelete({
      id:+id
    })
  }
}
