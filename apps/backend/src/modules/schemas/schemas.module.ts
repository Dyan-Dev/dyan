import { Module } from '@nestjs/common';
import { SchemasController } from './schemas.controller';
import { SchemasService } from './schemas.service';
import { SchemasService } from './schemas.service';
import { SchemasController } from './schemas.controller';

@Module({
  controllers: [SchemasController],
  providers: [SchemasService]
})
export class SchemasModule {}
