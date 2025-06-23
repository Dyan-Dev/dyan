import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemasModule } from './modules/schemas/schemas.module';
import { GenerateModule } from './modules/generate/generate.module';
import { EndpointController } from './endpoint/endpoint.controller';

@Module({
  imports: [SchemasModule, GenerateModule],
  controllers: [AppController, EndpointController],
  providers: [AppService],
})
export class AppModule {}
