import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EndpointController } from './endpoint/endpoint.controller';
import { DynamicController } from './dynamic/dynamic.controller';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core'; // 👈 needed for global guard

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env', '.env'],
      isGlobal: true,
    }),
    JwtModule.register({
      secret: (() => {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        return process.env.JWT_SECRET;
      })(),
      signOptions: { expiresIn: '10m' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,   // TTL in seconds or milliseconds depending on version
          limit: 5,
        },
      ],
    }),
    AuthModule,
  ],
  controllers: [AppController, EndpointController, DynamicController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // 👈 this applies throttling globally
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
