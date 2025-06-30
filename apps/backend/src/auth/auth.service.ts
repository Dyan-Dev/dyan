import { Injectable, Inject, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async sendMagicLink(email: string) {
    const token = this.jwtService.sign(
      { email },
      {
        expiresIn: '10m', // Token valid for 10 minutes
      },
    );
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const loginUrl = `http://localhost:5173/auth/verify?token=${token}`;

    await this.prisma.magicLinkToken.create({
      data: {
        email,
        token,
        expiresAt: expiresAt,
      },
    });

    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
      // Specify SMTP transport explicitly
      // @ts-ignore
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'your_gmail_or_smtp_user',
        pass: process.env.EMAIL_PASS || 'your_email_password_or_app_password',
      },
    } as nodemailer.TransportOptions);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Magic Login Link',
      html: `Click to login: <a href="${loginUrl}">${loginUrl}</a>`,
    });

    return { message: 'Login link sent!' };
  }

  async verifyToken(token: string) {
    try {
      const { email } = this.jwtService.verify(token);

      let user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        const userCount = await this.prisma.user.count();
        user = await this.prisma.user.create({
          data: {
            email,
            isAdmin: userCount === 0, // First user is admin
          },
        });
      }

      const sessionToken = this.jwtService.sign(
        { userId: user.id },
        {
          expiresIn: '7d', // Session lasts 7 days
        },
      );

      return {
        token: sessionToken,
        user: { email: user.email, isAdmin: user.isAdmin },
      };
    } catch (err) {
      throw new HttpException('Invalid or expired token', 401);
    }
  }
}
