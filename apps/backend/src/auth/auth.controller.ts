import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
const prisma = new PrismaClient();

@Controller('dyan/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

@Get('me')
async me(@Req() req: Request) {
    const token = req.cookies?.['dyan-token'];
    console.log('[me] Received request with token:', token);

    if (!token) {
        console.warn('[me] No token found in cookies');
        throw new UnauthorizedException('No token found');
    }

    try {
        const payload = await this.jwtService.verifyAsync<{ userId: string }>(
            token,
        );
        console.log('[me] Decoded JWT payload:', payload);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { email: true, isAdmin: true },
        });

        if (!user) {
            console.warn('[me] No user found for email:', payload.userId);
            throw new UnauthorizedException('User not found');
        }

        console.log('[me] User found:', user);
        return user;
    } catch (error) {
        console.error('[me] Error verifying token or fetching user:', error);
        throw new UnauthorizedException('Invalid token');
    }
}

  @Post('request')
  async requestLogin(@Body('email') email: string) {
    if (!email || !email.includes('@')) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await prisma.user.findFirst();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // first user becomes admin
      user = await prisma.user.create({
        data: { email, isAdmin: !existingUser },
      });
    }

    return this.authService.sendMagicLink(email);
  }

  @Get('verify')
  async verifyLogin(@Query('token') token: string, @Res() res: Response) {
    const { token: sessionToken, user } =
      await this.authService.verifyToken(token);

    res.cookie('dyan-token', sessionToken, {
      httpOnly: true,
      secure: false, // set to true in production (with HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    console.log('Set-Cookie header sent:', sessionToken);

    return res.json({ message: 'Logged in', user });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('dyan-token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
