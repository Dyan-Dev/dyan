import { Body, Controller, Post } from '@nestjs/common';
import { generateNestRoute, RouteSchema } from '../../../../../packages/codegen/dist';

@Controller('api/generate')
export class GenerateController {
  @Post()
  generate(@Body() dto: RouteSchema) {
    return generateNestRoute(dto);
  }
}