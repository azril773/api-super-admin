import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobActivityDto } from './dto/create-job_activity.dto';
import { UpdateJobActivityDto } from './dto/update-job_activity.dto';
import { DataSource } from 'typeorm';
import { JobActivity } from '../entities/job_activity.entity';
import { newDateLocal } from 'functions/dateNow';

@Injectable()
export class JobActivitiesService {
  private joinquery: string = "SELECT job_activities.*,job_activities.id as job_activities_id,submenus.menuIdId as menu_id,submenus.name as submenu_name,submenus.url as submenu_url,jobs.name as job_name,jobs.description as job_description,jobs.icon as job_icon,jobs.url as job_url FROM job_activities JOIN submenus ON submenus.id=job_activities.submenuIdId JOIN jobs ON jobs.id=job_activities.jobIdId WHERE job_activities.deleted_at IS NULL"
  constructor(private readonly ds: DataSource) { }
  async create(createJobActivityDto: CreateJobActivityDto, name: string) {
    createJobActivityDto["created_by"] = name
    createJobActivityDto["upadated_by"] = name
    return await this.ds.getRepository(JobActivity).save(createJobActivityDto)
  }

  async findAll() {
    return await this.ds.query(`${this.joinquery}`);
  }

  async findOne(id: number) {
    return await this.ds.query(`${this.joinquery} AND job_activities.id=?`, [id]);
  }

  async update(id: number, updateJobActivityDto: UpdateJobActivityDto, name: string) {
    const repo = this.ds.getRepository(JobActivity)
    const data = await repo.findBy({ id: +id })
    if (data.length <= 0) throw new BadRequestException("Job access not found")
    data[0]["job_id"] = updateJobActivityDto["job_id"]
    data[0]["jobIdId"] = updateJobActivityDto["job_id"]
    data[0]["submenu_id"] = updateJobActivityDto["submenu_id"]
    data[0]["submenuIdId"] = updateJobActivityDto["submenu_id"]
    data[0]["updated_by"] = name
    data[0]["updated_at"] = newDateLocal()
    return await repo.save(data, {})
  }

  async remove(id: number, name: string) {
    const repo = this.ds.getRepository(JobActivity)
    await repo.update({
      id: +id
    }, {
      updated_by: name,updated_at:newDateLocal()
    })
    return await repo.softDelete({
      id: +id
    })
  }
}
