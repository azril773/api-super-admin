import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UnauthorizedException, BadRequestException, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentClassService } from './student-class.service';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';
import { decryptJwt } from 'functions/decrypt-jwt';
import { DataSource } from 'typeorm';
import { Class } from '../class/entities/class.entity';
import { MasterClass } from '../master-class/entities/master-class.entity';
import { Periode } from 'src/periode/entities/periode.entity';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { AuthorJob } from 'guards/author-job.guard';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { StudentClass } from './entities/student-class.entity';
import { newDateLocal } from 'functions/dateNow';

@Controller('student-class')
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class StudentClassController {
  constructor(private readonly studentClassService: StudentClassService,private readonly ds:DataSource) {}

  private createObj = {}

  private decrypt(jwt:string){
    const access_token = jwt ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }

  private async checkClass(id:number | string){
    const check = await this.ds.getRepository(Class).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("class not found")
    return check
  }

  private async checkPeriode(id:number | string){
    const check = await this.ds.getRepository(Periode).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("periode not found")
    return check
  }

  private async checkMasterClass(id:number | string){
    const check = await this.ds.getRepository(MasterClass).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("master class not found")
    return check
}

private async checkAll(periodeId:number,masterClassId:number,classid:number){
    const check = await this.ds.query("SELECT * FROM student_class WHERE classIdId=? AND masterClassIdId=? AND periodeIdId=? AND deleted_at IS NULL",[classid,masterClassId,periodeId])
    console.log(check,"kont")
    if(check.length > 0) throw new BadRequestException("data already exist")
    return check
  }

  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a student class", [])
  async create(@Body() createStudentClassDto: CreateStudentClassDto,@Headers('x-authorization') xAuthorization:string) {
    const {class_id,masterClass_id,periode_id} = createStudentClassDto
    const jwts = this.decrypt(xAuthorization)
    await this.checkClass(class_id)
    await this.checkPeriode(periode_id)
    await this.checkMasterClass(masterClass_id)
    const data = await this.checkAll(periode_id,masterClass_id,class_id)
    console.log(data,"sdsdlk")
    createStudentClassDto["classIdId"] = class_id
    createStudentClassDto["masterClassIdId"] = masterClass_id
    createStudentClassDto["periodeIdId"] = periode_id
    createStudentClassDto["created_by"] = jwts.name
    createStudentClassDto["updated_by"] = jwts.name

    return await this.studentClassService.create(createStudentClassDto);
  }

  @Get()
  @AuthorDec([105])
  @ResCode(201, "Success get all student class", [])
  async findAll() {
    return await this.ds.query("SELECT periodes.periode, periodes.id as id_p, master_class.id as id_mc, classes.id as id_c, master_class.name, classes.class,student_class.id FROM student_class JOIN periodes ON periodes.id=student_class.periodeIdId JOIN classes ON classes.id=student_class.classIdId JOIN master_class ON master_class.id=student_class.masterClassIdId WHERE student_class.deleted_at IS NULL ORDER BY classes.class,master_class.name, periodes.periode ASC")
  }

  @Get(':id')
  @AuthorDec([105])
  @ResCode(201, "Success get a student class", [])
  async findOne(@Param('id') id: string) {
    return await this.ds.query("SELECT periodes.periode, periodes.id as id_p, master_class.id as id_mc, classes.id as id_c, master_class.name, classes.class,student_class.id FROM student_class JOIN periodes ON periodes.id=student_class.periodeIdId JOIN classes ON classes.id=student_class.classIdId JOIN master_class ON master_class.id=student_class.masterClassIdId WHERE student_class.deleted_at IS NULL AND student_class.id=? ORDER BY classes.class,master_class.name, periodes.periode ASC",[+id])
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(201, "Success update a student class", [])
  async update(@Param('id') id: string, @Body() updateStudentClassDto: UpdateStudentClassDto,@Headers('x-authorization') xAuthorization:string) {
    console.log("atas")
    const jwts = this.decrypt(xAuthorization)
    const {class_id,masterClass_id,periode_id} = updateStudentClassDto
    await this.checkClass(class_id)
    await this.checkPeriode(periode_id)
    await this.checkMasterClass(masterClass_id)

    const checkId = await this.ds.getRepository(StudentClass).findBy({id:+id})

    if(checkId.length <= 0) throw new BadRequestException("data not found")
    console.log(checkId)
    const data = await this.ds.query("SELECT * FROM student_class WHERE masterClassIdId=? AND periodeIdId=? AND classIdId =? AND id <> ? AND deleted_at IS NULL",[masterClass_id,periode_id,class_id,+id])
    if(data.length > 0) throw new BadRequestException("data already exist")
    console.log(id)
    updateStudentClassDto["classIdId"] = class_id
    updateStudentClassDto["masterClassIdId"] = masterClass_id
    updateStudentClassDto["periodeIdId"] = periode_id
    updateStudentClassDto["updated_by"] = jwts.name
    updateStudentClassDto["updated_at"] = newDateLocal()
    return await this.studentClassService.update(+id, updateStudentClassDto);
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(201, "Success delete a student class", [])
  async remove(@Param('id') id: string,@Headers('x-authorization') xAuthorization:string) {
    const jwts = this.decrypt(xAuthorization)
    const data = await this.ds.query("SELECT * FROM student_class WHERE id=? AND deleted_at IS NOT NULL",[+id])
    if(data.length > 0) throw new BadRequestException("data was deleted")
    const check = await this.ds.getRepository(StudentClass).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("data not found")
    return await this.studentClassService.remove(+id,jwts.name);
  }
}
