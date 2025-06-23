import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService]
})
export class GenerateModule {}
