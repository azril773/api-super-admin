import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, Equal, Not } from "typeorm";
import { CreateMapelDto } from "./dto/createMapel.dto";
import { Mapel } from "./entity/mapel.entity";
import { UpdateMapelDto } from "./dto/updateMape.dto";
import { newDateLocal } from "functions/dateNow";

@Injectable()
export class MapelService{
    constructor(private readonly ds:DataSource){}

    async create(createMapelDto: CreateMapelDto): Promise<Mapel | null> {
        const existingMapel = await this.ds.getRepository(Mapel).findOne({ where: { name: createMapelDto.name } });
        if (existingMapel) {
          throw new BadRequestException("data already exist"); // Mapel dengan name yang sama sudah ada
        }
        return await this.ds.getRepository(Mapel).save(createMapelDto);
      }
    

      async findAll(): Promise<Mapel[]> {
        return this.ds.getRepository(Mapel).find();
      }
      
      async findOne(id: number): Promise<Mapel | null> {
        return this.ds.getRepository(Mapel).findOneBy({ id });
      }
      
      async delete(id: number): Promise<void> {
        const result = await this.ds.getRepository(Mapel).softDelete({id});
        if (result.affected === 0) {
          throw new BadRequestException("data not found")
        }
      }


      async update(id: number, updateMapelDto: UpdateMapelDto,name:string): Promise<Mapel | null> {
        const existingMapel = await this.ds.getRepository(Mapel).findOneBy({ id });
        if (!existingMapel) {
          throw new BadRequestException("data not found"); // Tidak ditemukan mapel dengan ID tersebut
        }
        if (updateMapelDto.name && await this.ds.getRepository(Mapel).findOne({ where: { name: updateMapelDto.name, id: Not(Equal(id)) } })) {
          throw new BadRequestException("data already exist"); // Nama mapel sudah digunakan oleh mapel lain
        }
        updateMapelDto["updated_at"] = newDateLocal()
        updateMapelDto["updated_by"] = name
        await this.ds.getRepository(Mapel).update(id, updateMapelDto);
        return await this.ds.getRepository(Mapel).findOneBy({ id });
      }
    
}