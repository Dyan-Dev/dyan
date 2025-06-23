import { Module } from '@nestjs/common';
import { SchemasController } from './schemas.controller';
import { SchemasService } from './schemas.service';

@Module({
  controllers: [SchemasController],
  providers: [SchemasService]
})
export class SchemasModule {}
