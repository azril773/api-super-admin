import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtController } from './jwt.controller';

@Module({
  controllers: [JwtController],
  providers: [JwtService],
})
export class JwtModule {}
