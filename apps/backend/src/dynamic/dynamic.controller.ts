import { Controller } from '@nestjs/common';
import { All, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { VM } from 'vm2';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { EndpointStore } from '../endpoint.store';
const prisma = new PrismaClient();

@Controller('api')
export class DynamicController {
  // Handle all dynamic endpoint requests
  @All('*')
  async handleDynamic(@Req() req: Request, @Res() res: Response) {
    const normalizedPath = req.path.replace(/^\/api/, '');

    console.log('Incoming request to:', req.path, req.method);
    console.log('Normalized path:', normalizedPath);
    console.log('Stored endpoints:', EndpointStore['endpoints']);

    const match = await prisma.endpoint.findFirst({
      where: {
        path: normalizedPath,
        method: req.method,
      },
    });

    if (!match) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    try {
      if (match.language === 'javascript') {
        const vm = new VM({
          timeout: 1500,
          sandbox: {
            req: {
              path: req.path,
              method: req.method,
              headers: req.headers,
              query: req.query,
              body: req.body || {},
            },
            res,
            console,
            setTimeout,
            fetch: globalThis.fetch,
            uuid: uuidv4,
            helpers: {
              sayHello: () => 'Hello from helper!',
              sum: (a: number, b: number) => a + b,
            },
            db: {
              find: () => [{ id: 1, name: 'Test Record' }],
              insert: (doc: any) => ({ insertedId: uuidv4(), ...doc }),
              update: (id: string, changes: any) => ({ id, ...changes }),
            },
          },
        });

        const wrappedCode = `(async () => {\n${match.code}\n})()`;
        const result = vm.run(wrappedCode);

        if (result instanceof Promise) {
          result
            .then((data) => {
              if (!res.headersSent) res.json(data);
            })
            .catch((err) =>
              res
                .status(500)
                .send(`Async error executing logic: ${err.message}`),
            );
        } else {
          if (!res.headersSent) res.json(result);
        }
      } else if (match.language === 'python') {
        res.status(501).send('Python execution not yet implemented');
      } else {
        res.status(400).send('Unsupported language');
      }
    } catch (err: any) {
      console.error('Execution error:', err);
      if (!res.headersSent) {
        res.status(500).send(`Error executing logic: ${err.message}`);
      }
    }
  }
}
