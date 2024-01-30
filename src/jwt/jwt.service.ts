import { Injectable } from '@nestjs/common';
import { CreateJwtDto } from './dto/create-jwt.dto';
import { UpdateJwtDto } from './dto/update-jwt.dto';

@Injectable()
export class JwtService {
  create(createJwtDto: CreateJwtDto) {
    return 'This action adds a new jwt';
  }

  findAll() {
    return `This action returns all jwt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jwt`;
  }

  update(id: number, updateJwtDto: UpdateJwtDto) {
    return `This action updates a #${id} jwt`;
  }

  remove(id: number) {
    return `This action removes a #${id} jwt`;
  }
}
