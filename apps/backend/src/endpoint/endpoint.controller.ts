// File: apps/backend/src/endpoint/endpoint.controller.ts

import {
  Body,
  Controller,
  Query,
  Get,
  Post,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Endpoint } from '../endpoint.store';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Controller('dyan')
export class EndpointController {
  // Add this inside the @Controller('api') class:
  @Get('endpoints')
  async getAllEndpoints() {
    const endpoints = await prisma.endpoint.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        path: true,
        method: true,
        language: true,
      },
    });
    return endpoints;
  }

  // GET /api/endpoint?path=/your/path&method=POST
  @Get('endpoint')
  async getSingleEndpoint(
    @Query('path') path: string,
    @Query('method') method: string,
  ) {
    const cleanPath = path.replace(/^\/api/, '');
    const match = await prisma.endpoint.findFirst({
      where: {
        path: cleanPath,
        method,
      },
    });

    if (!match) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return match;
  }

  // Save a new endpoint
  @Post('endpoint')
  async addEndpoint(@Body() body: Endpoint) {
    const cleanPath = body.path.replace(/^\/api/, '');

    const existing = await prisma.endpoint.findFirst({
      where: {
        path: cleanPath,
        method: body.method,
      },
    });

    if (existing) {
      await prisma.endpoint.update({
        where: { id: existing.id },
        data: {
          language: body.language,
          code: body.code,
        },
      });
    } else {
      await prisma.endpoint.create({
        data: {
          path: cleanPath,
          method: body.method,
          language: body.language,
          code: body.code,
        },
      });
    }

    return { message: 'Endpoint saved to DB' };
  }

  @Put('endpoint')
  async updateEndpoint(@Body() body: Endpoint) {
    const cleanPath = body.path.replace(/^\/api/, '');

    const existing = await prisma.endpoint.findFirst({
      where: { path: cleanPath, method: body.method },
    });

    if (!existing) {
      throw new HttpException('Endpoint not found', HttpStatus.NOT_FOUND);
    }

    const updated = await prisma.endpoint.update({
      where: { id: existing.id },
      data: {
        language: body.language,
        code: body.code,
      },
    });

    return { message: 'Endpoint updated', endpoint: updated };
  }

  @Delete('endpoint')
  async deleteEndpoint(@Body() body: { path: string; method: string }) {
    const cleanPath = body.path.replace(/^\/api/, '');

    const existing = await prisma.endpoint.findFirst({
      where: { path: cleanPath, method: body.method },
    });

    if (!existing) {
      throw new HttpException('Endpoint not found', HttpStatus.NOT_FOUND);
    }

    await prisma.endpoint.delete({
      where: { id: existing.id },
    });

    return { message: 'Endpoint deleted successfully' };
  }
}
