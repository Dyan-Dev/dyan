// File: apps/backend/src/endpoint/endpoint.controller.ts

import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  All,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EndpointStore, Endpoint } from '../endpoint.store';
import { VM } from 'vm2';

@Controller('api')
export class EndpointController {
  // Route to save a new endpoint
  @Post('endpoint')
  addEndpoint(@Body() body: Endpoint) {
    // Normalize path by removing leading /api if present
    const cleanPath = body.path.replace(/^\/api/, '');
    EndpointStore.add({ ...body, path: cleanPath });
    return { message: 'Endpoint saved successfully' };
  }

  // Catch-all route for any saved dynamic endpoint
  @All('*')
  async handleDynamic(@Req() req: Request, @Res() res: Response) {
    const normalizedPath = req.path.replace(/^\/api/, '');

    console.log('Incoming request to:', req.path, req.method);
    console.log('Normalized path:', normalizedPath);
    console.log('Stored endpoints:', EndpointStore['endpoints']);

    const match = EndpointStore.find(normalizedPath, req.method);

    if (!match) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    try {
      if (match.language === 'javascript') {
        res.status(200).json({ message: 'Dummy response for JavaScript endpoint' });
      } else if (match.language === 'python') {
        res.status(501).send('Python execution not yet implemented');
      } else {
        res.status(400).send('Unsupported language');
      }
    } catch (err) {
      console.error('Execution error:', err);
      res.status(500).send(`Error executing logic: ${err}`);
    }
  }
}
