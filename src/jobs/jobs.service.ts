import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DataSource } from 'typeorm';
import { Job } from './entities/job.entity';
import { newDateLocal } from 'functions/dateNow';

@Injectable()
export class JobsService {
  constructor(private readonly ds:DataSource){}
  async create(createJobDto: CreateJobDto,name:string) {
    createJobDto["created_by"] = name
    createJobDto["updated_by"] = name
    console.log(name)
    return await this.ds.getRepository(Job).save(createJobDto)
  }

  async findAll() {
    return await this.ds.getRepository(Job).find()
  }

  async findOne(key:string,value: number | string) {
    let obj = {}
    obj[key] = value
    return await this.ds.getRepository(Job).findBy(obj)
  }

  async update(id: number, updateJobDto: UpdateJobDto,name:string) {
    const repo = this.ds.getRepository(Job)
    const data = await repo.find({where:{id:+id}})
    console.log(data)
    if(data.length <= 0) throw new BadRequestException("Job not found")
    data[0]["name"] = updateJobDto["name"]
    data[0]["description"] = updateJobDto["description"]
    data[0]["icon"] = updateJobDto["icon"]
    data[0]["url"] = updateJobDto["url"]
    data[0]["updated_by"] = name
    data[0]["updated_at"] = newDateLocal()
    return await repo.save(data,{})
  }

  async remove(id: number) {
    return await this.ds.getRepository(Job).softDelete({
      id:+id
    })
  }
}
