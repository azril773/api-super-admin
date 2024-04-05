import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DataSource } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly ds:DataSource){}
  async create(createStudentDto: CreateStudentDto) {
    return await this.ds.getRepository(Student).save(createStudentDto)
  }

  async findAll() {
    return await this.ds.getRepository(Student).find()
  }

  async findOne(id: number,key:string) {
    let obj = {}
    obj[key] = id
    return await this.ds.getRepository(Student).findBy(obj)
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    return await this.ds.getRepository(Student).update({id:+id},{studentClass_id:updateStudentDto.studentClass_id,studentClassIdId:updateStudentDto.studentClass_id})
  }

  async remove(id: number,name:string) {
    await this.ds.getRepository(Student).update({id:+id},{updated_by:name})
    return await this.ds.getRepository(Student).softDelete({id:+id})
  }
}
