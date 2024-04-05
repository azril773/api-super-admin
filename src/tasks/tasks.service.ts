import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { Db } from 'mongodb';

@Injectable()
export class TasksService {
  constructor(private readonly ds:DataSource){}
  async create(createTaskDto: CreateTaskDto) {
    // return await this.ds.getRepository(Task).save(createTaskDto)
  }

  async findAll(name:string) {
    return await this.ds.getRepository(Task).find({where:{created_by:name}})
  }

  async findOne(key:string,value: string | number,name:string) {
    let obj = {}
    obj[key] = value
    obj["created_by"] = name
    return await this.ds.getRepository(Task).find({
      where:obj
    })
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    // return await this.ds.getRepository(Task).update({id:+id},updateTaskDto)
  }

  async remove(id: number,name:string) {
    await this.ds.getRepository(Task).update({id:+id},{updated_by:name})
    return await this.ds.getRepository(Task).softDelete({id:+id})
  }
}
