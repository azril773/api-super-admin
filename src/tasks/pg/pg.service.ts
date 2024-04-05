import { Inject, Injectable } from '@nestjs/common';
import { CreatePgDto } from './dto/create-pg.dto';
import { UpdatePgDto } from './dto/update-pg.dto';
import { Db, ObjectId } from 'mongodb';

@Injectable()
export class PgService {
  constructor(@Inject("Database") private readonly db:Db){}
  async create(createPgDto: CreatePgDto) {
    return await this.db.collection("pg").insertOne(createPgDto)
  }

  async findAll(name:string) {
    return await this.db.collection("pg").find({deleted_at:null,created_by:name}).toArray();
  }

  async findOne(kode: string,name:string) {
    return await this.db.collection("pg").findOne({kode,deleted_at:null,created_by:name})
  }

  async update(kode: string, updatePgDto: UpdatePgDto) {
    console.log(updatePgDto)
    return this.db.collection("pg").updateOne({
      kode
    },{
      $set:updatePgDto
    })
  }

  async remove(kode: string) {
    return await this.db.collection("pg").deleteOne({kode})
  }
}
