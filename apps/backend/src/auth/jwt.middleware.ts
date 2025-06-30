import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const originalUrl = req.originalUrl;
    const publicPaths = [
      /^\/api\//, // All user-defined APIs
      /^\/dyan\/auth\/request$/, // Auth email request
      /^\/dyan\/auth\/verify/, // Email link verification
      /^\/dyan\/auth\/me$/, // Get current user info
    ];

    const isPublic = publicPaths.some((pattern) => pattern.test(originalUrl));

    if (isPublic) {
      return next();
    }

    const token = req.cookies?.['dyan-token'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      (req as any).user = payload;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
