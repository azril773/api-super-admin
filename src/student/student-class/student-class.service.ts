import { Injectable } from '@nestjs/common';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';
import { DataSource } from 'typeorm';
import { StudentClass } from './entities/student-class.entity';
import { newDateLocal } from 'functions/dateNow';

@Injectable()
export class StudentClassService {
  constructor(private readonly ds:DataSource){}
  async create(createStudentClassDto:CreateStudentClassDto) {
    console.log(createStudentClassDto)
    return await this.ds.getRepository(StudentClass).save(createStudentClassDto)
  }

  async findAll() {
    return await this.ds.getRepository(StudentClass).find()
  }

  async findOne(id: number,key:string) {
    let obj = {}
    obj[key] = id
    return await this.ds.getRepository(StudentClass).findBy(obj)
  }

  async update(id: number, updateStudentClassDto:UpdateStudentClassDto) {
    console.log(updateStudentClassDto)
    return await this.ds.getRepository(StudentClass).update({id:+id},updateStudentClassDto)
  }

  async remove(id: number,name:string) {
    await this.ds.getRepository(StudentClass).update({id:+id},{updated_by:name})
    return await this.ds.getRepository(StudentClass).softRemove({id:+id})
  }
}
