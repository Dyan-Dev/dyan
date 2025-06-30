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

    console.log(`[JwtMiddleware] Incoming request: ${originalUrl}`);
    console.log(`[JwtMiddleware] Cookies:`, req.cookies);

    const isPublic = publicPaths.some((pattern) => pattern.test(originalUrl));
    console.log(`[JwtMiddleware] Is public path: ${isPublic}`);

    if (isPublic) {
      console.log(
        `[JwtMiddleware] Skipping auth for public path: ${originalUrl}`,
      );
      return next();
    }

    const token = req.cookies?.['dyan-token'];
    console.log(`[JwtMiddleware] dyan-token: ${token}`);

    if (!token) {
      console.warn(`[JwtMiddleware] No token provided for: ${originalUrl}`);
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      (req as any).user = payload;
      console.log(`[JwtMiddleware] Token verified. User payload:`, payload);
      next();
    } catch (err) {
      console.error(
        `[JwtMiddleware] Invalid or expired token for: ${originalUrl}`,
        err,
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
