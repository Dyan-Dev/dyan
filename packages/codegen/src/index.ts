export interface RouteSchema {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  logic: string;
}

export function generateNestRoute({ path, method, logic }: RouteSchema): string {
  return `
import { Controller, ${method}, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('${path.slice(1)}')
export class GeneratedController {
  @${method.toLowerCase()}()
  handle(@Req() req: Request, @Res() res: Response) {
    ${logic}
  }
}
  `;
}
