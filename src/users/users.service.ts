import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class UsersService {
  constructor(private readonly ds:DataSource){}
  async create(createUserDto: CreateUserDto,name:string) {
    createUserDto["created_by"] = name
    createUserDto["updated_by"] = name
    return await this.ds.getRepository(User).save(createUserDto)
  }

  async findAll() {
    const data = await this.ds.query("SELECT users.created_at as created_user,users.updated_at as updated_user,users.deleted_at as deleted_user, users.created_by as createdBy_user,users.updated_by as updatedBy_user, job_accesses.*, users.* FROM users LEFT JOIN job_accesses ON users.id=job_accesses.userIdId")
    return data
  }

  async findOne(key:string,value: number | string) {
    let obj = {}
    obj[key] = value
    return await this.ds.getRepository(User).findBy(obj);
  }

  async update(id: number, updateUserDto: UpdateUserDto,name:string) {
    const repo = this.ds.getRepository(User)
    const data = await repo.find({
      where:{
        id:+id
      }
    })
    data[0].name = updateUserDto.name
    data[0].picture = updateUserDto.picture
    data[0].role_id = updateUserDto.role_id
    data[0].status = updateUserDto.status
    return await repo.save(data)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
