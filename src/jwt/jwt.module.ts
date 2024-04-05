import { Module } from '@nestjs/common';
import { JwtController } from './jwt.controller';

@Module({
  controllers: [JwtController],
  providers: [],
})
export class JwtModule {}
