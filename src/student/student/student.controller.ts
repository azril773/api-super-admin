import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UnauthorizedException, Headers, BadRequestException } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { decryptJwt } from 'functions/decrypt-jwt';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { StudentClass } from '../student-class/entities/student-class.entity';
import { Student } from './entities/student.entity';
import { newDateLocal } from 'functions/dateNow';

@Controller('student')
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class StudentController {
  constructor(private readonly studentService: StudentService, private readonly ds: DataSource) { }

  private decrypt(jwt: string) {
    const access_token = jwt ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }

  private async checkUser(user_id: number) {
    const data = await this.ds.query("SELECT * FROM users JOIN roles ON users.roleIdId=roles.id WHERE users.id=? AND roles.name=? AND users.  deleted_at IS NULL",[+user_id,"siswa"])
    if (data.length <= 0) throw new BadRequestException("only student can be added")
    return data
  }

  private async checkStudentClass(id: number) {
    const data = await this.ds.getRepository(StudentClass).findBy({ id: +id })
    if (data.length <= 0) throw new BadRequestException("student class not found")
    return data
  }

  private async check(user_id: number, id: number) {
    const data = await this.ds.query("SELECT * FROM students WHERE userIdId=? AND deleted_at IS NULL", [+user_id, +id])
    if (data.length > 0) throw new BadRequestException("student already exist")
    return data
  }

  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a student", [])
  async create(@Body() createStudentDto: CreateStudentDto, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const { studentClass_id, user_id } = createStudentDto
    await this.checkUser(user_id)
    await this.checkStudentClass(studentClass_id)
    await this.check(user_id, studentClass_id)

    createStudentDto["created_by"] = jwts.name
    createStudentDto["userIdId"] = +user_id
    createStudentDto["studentClassIdId"] = +studentClass_id
    createStudentDto["updated_by"] = jwts.name
    return await this.studentService.create(createStudentDto);
  }

  @Get()
  @AuthorDec([105])
  @ResCode(200, "Success get a student", [])
  async findAll() {
    return await this.ds.query("SELECT student_class.id as id_sc, students.id as id_s,users.id as id_u, master_class.name as major_name,classes.class,periodes.periode,users.name as name_student FROM students JOIN users ON users.id=students.userIdId JOIN student_class ON students.studentClassIdId=student_class.id JOIN master_class ON master_class.id=student_class.masterClassIdId JOIN classes ON classes.id=student_class.classIdId JOIN periodes ON periodes.id=student_class.periodeIdId WHERE students.deleted_at IS NULL ORDER BY classes.class,periodes.periode,master_class.name")

  }

  @Get(':id')
  @AuthorDec([105])
  @ResCode(200, "Success get all student", [])
  async findOne(@Param('id') id: string) {
    return await this.ds.query("SELECT student_class.id as id_sc, students.id as id_s,users.id as id_u, master_class.name as major_name,classes.class,periodes.periode,users.name as name_student FROM students JOIN users ON users.id=students.userIdId JOIN student_class ON students.studentClassIdId=student_class.id JOIN master_class ON master_class.id=student_class.masterClassIdId JOIN classes ON classes.id=student_class.classIdId JOIN periodes ON periodes.id=student_class.periodeIdId WHERE students.deleted_at IS NULL AND students.id=? ORDER BY classes.class,periodes.periode,master_class.name",[+id]);
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(200, "Success update a student", [])
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const { studentClass_id, user_id } = updateStudentDto
    await this.checkUser(+updateStudentDto.user_id)
    const data = await this.ds.getRepository(Student).findBy({ id: +id })
    if (data.length <= 0) throw new BadRequestException("data not found")
    await this.checkStudentClass(studentClass_id)
    updateStudentDto["updated_by"] = jwts.name
    updateStudentDto["updated_at"] = newDateLocal()
    return await this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(200, "Success delete a student", [])
  async remove(@Param('id') id: string, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const data = await this.ds.query("SELECT * FROM students WHERE id=? AND deleted_at IS NOT NULL", [+id])
    if (data.length > 0) throw new BadRequestException("data was deleted")
    const check = await this.ds.getRepository(Student).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("data not found")
    return await this.studentService.remove(+id, jwts.name);
  }
}
